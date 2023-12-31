/* src/App.js */
import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation,Storage } from 'aws-amplify'
import { createTranSchema,createTranEcho,createTranLoadFile } from './graphql/mutations'
import { listTranSchemas ,echo,load,listTranEchos,listTranLoadFiles} from './graphql/queries'
import Grid from '@mui/material/Unstable_Grid2';
import { withAuthenticator, Text, TextField, View,FileUploader } from '@aws-amplify/ui-react';
import { Paper, Button,LinearProgress, ToggleButton, ToggleButtonGroup} from '@mui/material';
import '@aws-amplify/ui-react/styles.css';
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', msg: '' }

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])
  const [keyData, setKeyData] = useState([])
  const [dataLoad,setDataLoad] = useState([])
  const [ListLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alignment, setAlignment] = useState('keyphrases');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileLoad,setFileLoad] = useState([]);
  const [S3List,setS3List] = useState([]);


  const onSuccess = async ({ key }) => {
    setMessage(`Key: ${key}`);
    setLoading(true)
    const response = await API.graphql(graphqlOperation(load, {file:key}));
    const text = response.data.load
    await createLoadFile(key,text)
    await fetchS3List()
    setLoading(false)

  };
  const handleTextClick = async (key) => {
    try {
      setFileLoad(key)
      setListLoading(true)
    } catch (error) {
      console.error('Error in GraphQL query:', error);
    }
  };

  const handleChange = (event, newAlignment) => {
      if(event != "keyphrases"){
        fetchS3List()
      }
      console.log(newAlignment);
      setAlignment(newAlignment);      
  };
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos])

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       await Storage.list('', { level: "public" }) 
//       .then (result => setS3List(result.results))
//       .catch(err => console.log(err));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//    fetchData();
// }, [message]);


const fetchS3List = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTranLoadFiles))
      const name = todoData.data.listTranLoadFiles?.items
      console.log(name)
      setS3List(name)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  async function sortField(data) {
    data?.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  useEffect(() => {
    const fetchKeyData = async () => {
      try {
        const todoData = await API.graphql(graphqlOperation(listTranSchemas))
        const keyPhrases = await API.graphql(graphqlOperation(listTranEchos))
        const keyData = keyPhrases.data.listTranEchos.items
        const todos = todoData.data.listTranSchemas.items
        const mergedArray = todos.reduce((acc, currentValue) => {
          const matchingObject = keyData.find(item => item.tranSchemaEchoesId === currentValue.id);
          
          if (matchingObject) {
            acc.push({ ...currentValue, ...matchingObject });
        }
        
          return acc;
        }, []);
        sortField(mergedArray)
        setKeyData(mergedArray);
        setLoading(false)
      } catch (err) { console.log('error fetching todos') }
    };
    fetchKeyData();
  }, [dataLoad])

  async function createEcho(user,key) {
    try {
      const userID=user?.data.createTranSchema.id || null
      const keyData = await API.graphql(graphqlOperation(createTranEcho, {input: {message: key, tranSchemaEchoesId:userID}}))
      setDataLoad(keyData)
      //fetchKeyData()
    } catch (err) { console.log('error fetching todos') }
  }

  async function createLoadFile(fileName,key) {
    try {
      const keyData = await API.graphql(graphqlOperation(createTranLoadFile, {input: {filename: fileName , document: key}}))
    } catch (err) { console.log('error createLoadFile') }
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTranSchemas))
      const todos = todoData.data.listTranSchemas.items
      sortField(todos)
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }
  
  async function addTodo() {
    try {
      if (!formState.name || !formState.msg) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      setLoading(true)
      const user = await API.graphql(graphqlOperation(createTranSchema, {input: todo}))
      const text = await API.graphql(graphqlOperation(echo, {msg:formState.msg}))
      const key=text.data.echo
      await createEcho(user,key)
      setInput(initialState)
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }
    
  return (
    <Grid container spacing={2} style={{margin:"20px 40px"}}>
    {alignment == 'keyphrases' ? (<Grid xs={8}>
        {
          !todos ?(
            <Paper style={styles.containerMain}>
              <Text style={styles.todoName}>No Data</Text>
            </Paper>
          ) : (
            <Paper style={styles.containerMain}>
              {todos.map((todo, index) => (
                <Paper key={todo.id ? todo.id : index} elevation={3} style={styles.todo}>
                  <>
                    <Text style={styles.todoName}>{todo.name} :</Text>
                    <Text style={styles.todomsg}>{todo.msg}</Text>
                  </>
                </Paper>
              ))}
            </Paper>
          )
        }

        </Grid>):(
          <Grid xs={8}>
              <Paper style={styles.containerMain}>
                <Paper elevation={3} style={styles.todo}>
                  {ListLoading ? (
                    <span>{fileLoad}</span>
                  ):(
                    null
                  )} 
                  </Paper>
              </Paper>
          </Grid>
        )}
        
        <Grid xs={4} style={{ display: 'flex', flexDirection: 'column'}}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <View style={styles.container}>
                <ToggleButtonGroup
                  color='standard'
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                  style={styles.toggleButtonGroup}
                >
                  <ToggleButton value="keyphrases">keyphrases</ToggleButton>
                  <ToggleButton value="uploadFile">uploadFile</ToggleButton>
                </ToggleButtonGroup>
                {alignment == 'keyphrases' ? (
                  <>
                  <TextField
                    placeholder="Name"
                    onChange={event => setInput('name', event.target.value)}
                    style={styles.input}
                    defaultValue={formState.name}
                  />
                  <TextField
                    placeholder="Comment"
                    onChange={event => setInput('msg', event.target.value)}
                    style={styles.input}
                    defaultValue={formState.msg}
                  />
                  <Button style={styles.button} onClick={addTodo}>キーワード抽出</Button>
                  </>
                ):(
                  <>
                    <FileUploader
                      onSuccess={onSuccess}
                      variation="drop"
                      acceptedFileTypes={['.docx', '.xlsx', '.doc', '.md', '.json', '.pdf', '.txt']}
                      accessLevel="public"
                      sx={{maxHeight:"75px",padding:'-8px'}}
                    />
                    {message}
                  </>
                )}
                  
                </View>
                <View style={styles.container}>
                <Paper style={{ borderRadius:"10px",height: '50vh' ,justifyContent: 'center',backgroundColor: '#ddd', maxHeight: '378px',overflow: 'auto', margin: '10px', padding: 20 }}>
                {loading ? (
                  <LinearProgress style={{top:"-13px"}}/>
                  ) : null }
                {alignment === 'keyphrases' ? (
                  keyData && keyData.map((key, index) => (              
                    <Paper elevation={3} style={{ display: 'flex', padding: '5px', margin: "12px" }}>
                      <Text style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>{key.name}:  </Text>
                        <Text>{key.message}</Text>
                      </Text>
                    </Paper>
                  ))
                ) : (
                  S3List && S3List.map((key, index) => (
                  <Paper elevation={3} style={{ display: 'flex', padding: '5px', margin: "12px" }}>
                    {loading ? (
                      <LinearProgress style={{top:"-13px"}}/>
                      ) : null }
                      <a
                        href="#"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        onClick={() => handleTextClick(key.document)}
                      >
                        <Text style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
                          <Text style={{ fontWeight: 'bold' }}> {key.filename}</Text>
                        </Text>
                        </a>
                    </Paper>
                    ))
                )}

                                    
                    </Paper>
                </View>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  containerMain: {borderRadius:"10px", margin: '25px auto',overflow: 'auto' , backgroundColor: '#ddd', justifyContent: 'center',height:'665px', maxHeight: '665px',padding: 30 },
  todo: {  marginBottom: 15 ,padding:'10px'},
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todomsg: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white',borderRadius:'8px', outline: 'none', fontSize: 18, padding: '12px 0px' },
  toggleButtonGroup: {flexDirection: 'row',
  justifyContent: 'center',
  marginBottom: 16},
  VisuallyHiddenInput:{ clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,}
  
}

export default withAuthenticator(App);

