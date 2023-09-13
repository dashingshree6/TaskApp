import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import { getTask, updateTask } from '../../API';
import SyncStorage from 'sync-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TaskScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [reload, setReload] = useState(false)
    const [taskToBeUpdated, setTaskToBeUpdated] = useState("");

    // Get all tasks
    useFocusEffect(
        React.useCallback(() => {
            getTask(SyncStorage.get('token'))
              .then(res => {
               setTasks(res.data.reverse())
              })
              .catch(err => {
                console.log(err.message);
              });
        }, [reload]),
      );
    
    // Update task status as completed
    const updateTaskStatus = (id) => {
        updateTask(SyncStorage.get('token'),id).then(res => {
            setReload(!reload)
            Alert.alert('Task Status', "Task marked as completed successfully")
        }).catch(err => {
            console.log(err)
        })
    }

    // Update task status as completed
    // useFocusEffect(
    //     React.useCallback(() => {
    //         if(taskToBeUpdated) {
    //             updateTask(taskToBeUpdated, SyncStorage.get('token')).then(res => {
    //                 setReload(!reload)
    //                 setTaskToBeUpdated("")
    //                 Alert.alert('Task Status', "Task marked as completed successfully")
    //             }).catch(err => {
    //                 console.log(err)
    //             })
    //         }
    //     }, [taskToBeUpdated]),
    //   );

  return (
    <View style={styles.container}>

      {/* Display list of all tasks */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
            <View style={styles.card}>
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
          
                <TouchableOpacity
                style={styles.completeBtn}
                onPress={()=> updateTaskStatus(item?._id)}
                >
                    <AntDesign name="checksquareo" size={18} color={'white'}/>
                    <Text style={styles.completeText}>Mark as completed</Text>
                </TouchableOpacity>
            </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: '#adebeb',
        flex:1,
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
    }
  });

export default TaskScreen;
