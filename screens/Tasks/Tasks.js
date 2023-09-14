import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, TextInput, Modal, CheckBox } from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import { deleteTask, getTask, updateTask } from '../../API';
import SyncStorage from 'sync-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux'
import { loaderOff, loaderOn } from '../Redux/authenticationSlice';
import RadioGroup from 'react-native-radio-buttons-group';

const TaskScreen = () => {
    const dispatch = useDispatch();
    const [tasks, setTasks] = useState([]);
    const [tasksList, setTasksList] = useState([]);
    const [reload, setReload] = useState(false)
    const [title, setTitle] = useState("");
    const [categoryModal, setCategoryModal] = useState(false);
    const [statusModal,setStatusModal] = useState(false);
    const [selectedCategory, setSelectedCategory]= useState("");
    const [selectedStatus, setSelectedSatus]= useState("");
    const categories = useMemo(() => ([
        {
            id: 'daily',
            label: 'Daily',
            value: 'daily'
        },
        {
            id: 'weekly',
            label: 'Weekly',
            value: 'weekly'
        },
        {
            id: 'monthly',
            label: 'Monthly',
            value: 'monthly'
        }
    ]), []);

    const status = useMemo(() => ([
        {
            id: 'Completed',
            label: 'Completed',
            value: 'Completed'
        },
        {
            id: 'Incomplete',
            label: 'Incomplete',
            value: 'Incomplete'
        }
    ]), []);

    // Get all tasks
    useFocusEffect(
        React.useCallback(() => {
            getTask(SyncStorage.get('token'))
              .then(res => {
               setTasks(res.data)
               setTasksList(res.data)
              })
              .catch(err => {
                console.log(err.message);
              });
        }, [reload]),
      );
    
    // Update task status as completed
    const updateTaskStatus = (id) => {
      dispatch(loaderOn())
        updateTask(id).then(res => {
            setReload(!reload)
            dispatch(loaderOff())
            Alert.alert('Task Status', "Task marked as completed successfully")
        }).catch(err => {
            dispatch(loaderOff())
            console.log(err)
        })
    }

    // Delete the task
    const deleteSingleTask = (id) => {
      dispatch(loaderOn())
          deleteTask(id).then(res => {
              setReload(!reload)
              dispatch(loaderOff())
              Alert.alert('Delete Task', "Task deleted successfully")
          }).catch(err => {
              dispatch(loaderOff())
              console.log(err)
          })
      }

      // Handle clear filters
      const handleClearFilters = () => {
        setTitle("")
        setSelectedCategory("")
        setSelectedSatus("")
        setTasks(tasksList)
      }


      // Filter tasks on the basis of title
      useEffect(()=>{
        if(title) {
          setTasks(tasksList?.filter(i => i?.title.toLowerCase().includes(title?.toLowerCase())))
        } else {
          setTasks(tasksList)
        }
      },[title])

      // Filter tasks on the basis of status
      useEffect(()=>{
        setStatusModal(false)
        if(selectedStatus === "Completed") {
          setTasks(tasksList?.filter(i => i?.completed === true))
        } else if(selectedStatus === "Incomplete") {
          setTasks(tasksList?.filter(i => i?.completed === false))
        } else {
          setTasks(tasksList)
        }
      },[selectedStatus])

      // Filter tasks on the basis of category
      useEffect(()=>{
        setCategoryModal(false)
        if(selectedCategory) {
          setTasks(tasksList?.filter(i => i?.category === selectedCategory ))
        } else {
          setTasks(tasksList)
        }
      },[selectedCategory])

  return (
    <View style={styles.container}>

      <TextInput 
      style={styles.input}
      onChangeText={setTitle}
      value={title}
      placeholder="Search for tasks"
      />

      <View style={styles.filterCont}>
        <TouchableOpacity
        style={styles.filterBtn}
        onPress={()=>{
          setStatusModal(false)
          setCategoryModal(true)
        }}
        >
          <Text>Category</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.filterBtn}
        onPress={()=>{
          setCategoryModal(false)
          setStatusModal(true)
        }}
        >
          <Text>Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.filterBtn}
        onPress={handleClearFilters}
        >
          <Text>Clear filters</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for filtering tasks category wise */}
      <Modal
      animationType="fade"
      transparent={true}
      visible={categoryModal}
      onRequestClose={() => {
        setCategoryModal(!categoryModal);
      }}>
        <View style={styles.modalContainer}>
        <View style={styles.categoryModalContainer}>
          <View style={styles.categorySubContainer}>
              <AntDesign onPress={()=>setCategoryModal(false)} name="close" size={25} color={'black'}/>
              <Text style={styles.categoryConText}>Select Category</Text>
          </View>
          <RadioGroup 
            radioButtons={categories} 
            onPress={setSelectedCategory}
            selectedId={selectedCategory}
            layout={"row"}
          />
        </View>
        </View>
      </Modal>

      {/* Modal for filtering tasks status wise */}
      <Modal
      animationType="fade"
      transparent={true}
      visible={statusModal}
      onRequestClose={() => {
        setStatusModal(!statusModal);
      }}>
        <View style={styles.modalContainer}>
        <View style={styles.categoryModalContainer}>
          <View style={styles.categorySubContainer}>
              <AntDesign onPress={()=>setStatusModal(false)} name="close" size={25} color={'black'}/>
              <Text style={styles.categoryConText}>Select Status</Text>
          </View>
          <RadioGroup 
          radioButtons={status} 
          onPress={setSelectedSatus}
          selectedId={selectedStatus}
          style={styles.filterCont}
          layout={"row"}
        />
        </View>
        </View>
      </Modal>

      {/* Display list of all tasks */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
            <View id={item?._id} style={styles.card}>
                <View style={styles.titleCont}>
                    <Text style={styles.category}>{item.category ? item.category?.substring(0,1) : "N/A"}</Text>
                    <Text style={styles.title}>{item.title ? item.title?.substring(0,15) : "N/A"}</Text>
                    <Text style={item.completed ? styles.statusC : styles.statusI}>
                        {item.completed ? "COMPLETED" : "INCOMPLETE"}
                    </Text>
                </View>

                <View 
                style={styles.contentContainer}
                >
                    <MaterialIcons name="description" size={18} color={'green'}/>
                    <Text style={styles.description}>{item.description ? item.description : "N/A"}</Text>
                </View>
                <View 
                style={styles.contentContainer}
                >        
                    <MaterialIcons name="calendar-today" size={18} color={'green'}/>
                    <Text style={styles.dueDate}>Complete this task before <Text style={{fontWeight:'500'}}>{item.dueDate ? String(item?.dueDate).substring(0,10) : "N/A"}</Text></Text>
                </View>
          
                <View style={styles.titleCont}>

                <TouchableOpacity
                style={styles.completeBtn}
                onPress={()=> updateTaskStatus(item?._id)}
                >
                    <AntDesign name="checksquareo" size={18} color={'white'}/>
                    <Text style={styles.completeText}>Mark as completed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.deleteBtn}
                onPress={()=> deleteSingleTask(item?._id)}
                >
                    <AntDesign name="delete" size={18} color={'white'}/>
                    <Text style={styles.completeText}>Delete</Text>
                </TouchableOpacity>

                </View>
            </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: '#ebebe0',
        flex:1,
    },
    modalContainer: {
      flex: 1,
      justifyContent:'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with 50% opacity
    },
    input: {
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 8,
      marginBottom: 12,
    },
    filterBtn: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 18,
      padding: 6,
      backgroundColor:'#fff',
      marginRight:4
    },
    filterCont:{
      flexDirection:'row'
    },
    categoryModalContainer: {
      backgroundColor: 'white',
      height:'20%',
      position:"absolute",
      bottom:0,
      width:'120%',
      padding:10
    },
    categorySubContainer: {
      flexDirection:'row',
      alignItems:'center',
      marginBottom:10
    },
    categoryConText: {
      fontSize:18,
      marginLeft:25
    },
    card: {
      backgroundColor: '#FFFFFF', // White background
      borderRadius: 10,
      padding: 16,
      margin: 10,
      elevation: 4, // For Android shadow
      shadowColor: 'rgba(0, 0, 0, 0.1)', // For iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      borderWidth: 1,
      borderColor: '#E0E0E0', // Light gray border
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333333', // Dark text color
    },
    titleCont: {
        flexDirection:'row',
        justifyContent:'space-between'
    },
    description: {
      fontSize: 16,
      marginBottom: 4,
      color: '#555555', // Slightly lighter text color
      marginLeft: 5
    },
    statusC: {
      fontSize: 13,
      marginBottom: 8,
      fontWeight: 'bold',
      borderWidth: 1,
      borderColor: 'green',
      borderRadius: 18,
      color:'green',
      padding:5
    },
    statusI: {
        fontSize: 13,
        marginBottom: 8,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 18,
        color:'red',
        padding:5
    },
    dueDate: {
      fontSize: 16,
      color: '#555555',
      marginLeft: 5
    },
    contentContainer:{
        flexDirection:'row',
        marginBottom:4,
    },
    category: {
      fontSize: 16,
      color: '#00394d',
      textTransform:'capitalize',
      fontWeight:'bold',
      borderWidth: 1,
      borderColor: '#00394d',
      borderRadius: 100,
      width:30,
      textAlign:'center',
      height:30,
      paddingTop:3
    },
    completeBtn:{
        flexDirection:'row',
        backgroundColor:'#ff9900',
        borderWidth: 1,
        borderColor: '#ff9900',
        borderRadius: 20,
        padding:8,
        alignItems:'center',
        justifyContent:"center"
    },
    completeText: {
        color:'#fff',
        fontWeight:'bold',
        marginLeft:10
    },
    deleteBtn:{
      flexDirection:'row',
      backgroundColor:'#ff1a1a',
      borderWidth: 1,
      borderColor: '#ff1a1a',
      borderRadius: 20,
      padding:8,
      alignItems:'center',
      justifyContent:"center"
  },
  });

export default TaskScreen;
