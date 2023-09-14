import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { createTask } from '../../API';
import SyncStorage from 'sync-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux'
import { loaderOff, loaderOn } from '../Redux/authenticationSlice';

const CreateTaskScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [category, setCategory] = useState("daily");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Show the ddate picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Hide date picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Picker will be closed after selecting date
  const handleConfirm = (date) => {
    setDueDate(date)
    hideDatePicker();
  };

  // Handler to create task
  const handleCreateTask = () => {
    if(!title || !description || !dueDate || !category) {
        Alert.alert("Create Task", "Please provide all fields");
    } else {
        dispatch(loaderOn())
        createTask({title, description, dueDate, category},SyncStorage.get('token')).then(res => {
            setTitle('');
            setDescription('');
            setDueDate(new Date())
            setCategory('daily');
            dispatch(loaderOff())

            Alert.alert("Create Task", "Task created successfully")
        }).catch(err => {
            dispatch(loaderOff())
            console.log(err)
        })
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.info}>
            <AntDesign name="infocirlce" size={18} color={'#ff0000'}/>
            <Text style={styles.infoText}>All fields are mandatory</Text>
        </View>
        <View style={styles.taskContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder="Enter task title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                onChangeText={setDescription}
                value={description}
                placeholder="Enter task description"
            />

            <Text style={styles.label}>Due date</Text>
            <View style={styles.dateCont}>
                    <Button title="Select Date" onPress={showDatePicker} />
                    <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    />
                    <Text onPress={showDatePicker} style={styles.dueDate}>{dueDate ? dueDate.toDateString() : "N/A"}</Text>
            </View>
            {/* Category Buttons */}
            <Text style={styles.label}>Select Category</Text>

            <View style={styles.categoryCont}>
            <TouchableOpacity
                style={[styles.categoryButton, category === "daily" && styles.selectedCategory]}
                onPress={() => setCategory("daily")}
            >
                <Text style={[styles.categoryButtonText, category === "daily" && styles.selecteddCategoryButtonText]}>Daily</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.categoryButton, category === "weekly" && styles.selectedCategory]}
                onPress={() => setCategory("weekly")}
            >
                <Text style={[styles.categoryButtonText, category === "weekly" && styles.selecteddCategoryButtonText]}>Weekly</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.categoryButton, category === "monthly" && styles.selectedCategory]}
                onPress={() => setCategory("monthly")}
            >
                <Text style={[styles.categoryButtonText, category === "monthly" && styles.selecteddCategoryButtonText]}>Monthly</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
                    {/* Clear and Create Task Buttons */}
                    <Pressable
                    onPress={() => {
                        setTitle('');
                        setDescription('');
                        setDueDate(new Date());
                        setCategory('daily');
                    }}
                    style={styles.bottomBtn1}
                    >
                        <Text style={styles.bottomBtnText}>Clear</Text>
                    </Pressable>

                    <Pressable 
                    style={styles.bottomBtn2} 
                    onPress={handleCreateTask} 
                    >
                        <Text style={styles.bottomBtnText}>Submit</Text>
                    </Pressable>
            </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#ebebe0',
      flex:1,
    },
    taskContainer:{      
      padding: 16,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
    },
    info: {
        flexDirection:'row',
        padding:4,
    },
    infoText:{
        marginLeft:10
    },
    label: {
      fontSize: 13,
      marginBottom: 4,
      color: 'grey',
    },
    input: {
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 8,
      marginBottom: 12,
    },
    dueDate: {
      fontSize: 16,
      color: '#555',
    },
    dateCont: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:4,
        marginBottom: 8,
        borderWidth:1,
        borderColor:'silver',
        padding: 8,
        borderRadius: 2,
    },
    categoryCont: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:4,
        marginBottom: 8,
    },
    categoryButton: {
      backgroundColor: '#fff',
      padding: 8,
      borderRadius: 20,
      marginBottom: 8,
      width:90,
      borderWidth:1,
      borderColor:'grey'
    },
    selectedCategory: {
      backgroundColor: '#0099e6',
    },
    categoryButtonText: {
      fontSize: 16,
      color: 'grey',
      textAlign: 'center',
    },
    selecteddCategoryButtonText: {
        color: '#fff'
      },
    bottomBtn1: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor:'#ff3333',
        width:'50%',
        alignItems:'center',
    },
    bottomBtn2: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor:'green',
        width:'50%',
        alignItems:'center',
    },
    btnContainer: {
        // position:'absolute',
        // bottom:10,
        flexDirection:'row',
        alignItems:'center'
    },
    bottomBtnText: {
        color:'#fff',
        fontWeight:'bold',
        fontSize: 16,
    }
  });

export default CreateTaskScreen;
