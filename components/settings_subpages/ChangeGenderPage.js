import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, Picker } from 'react-native';
import Constants from 'expo-constants';
import { TextInput } from 'react-native-gesture-handler';
import { CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';

class ChangeGenderPage extends Component {
    constructor() {
        super();
        this.state = {
            newGender: "Female",
            isLoading: false,
        };
    }

    save = () => {
        if (this.state.newGender === this.props.user.gender) return;
        this.setState({isLoading: true});
        const newUser = JSON.parse(JSON.stringify(this.props.user));
        newUser.gender = this.state.newGender;
        fetch('http://192.168.1.116:5000/users/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: newUser
            }),
        }).then(res => res.json()).then(json => {
            Alert.alert("Notification received: ", json.message);
            if (json.result == 1) {
                this.setState({
                    isLoading: false,
                });
                this.props.changeGender(this.state.newGender);
            }
            else {
                this.setState({
                    isLoading: false,
                });
            }
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoading: false,
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.viewStyle}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        return (
            <View style={styles.viewStyle}>
                <Text style = {styles.textStyleTitle}>
                    Change Gender
                </Text>
                <Text style = {styles.textStyle}>
                    Current Gender: {this.props.user.gender}
                </Text>
                <Text style = {styles.textStyle}></Text>
                <Picker
                    selectedValue={this.state.newGender}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({ newGender: itemValue })
                    }
                    prompt = "New Gender">
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Non-Binary" value="Non-Binary" />
                    <Picker.Item label="Male" value="Male" />
                </Picker>
                <Text style={styles.textStyle}> </Text>
                <Button onPress={this.save} title="Save"/>
            </View>
        )
    }  
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: Constants.statusBarHeight,
        justifyContent: 'center',
        padding: 20,
    },
    textStyle: {
        color: "black",
        fontSize: 20,
        marginBottom: 0,
        justifyContent: 'center',
    },
    textStyleTitle: {
        color: "black",
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 30,
    },
});

const mapStateToProps = (state) => {
    const { user } = state
    return { user }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeGender: (gender) => {
            dispatch({
                type: "CHANGE_GENDER",
                payload: gender,
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeGenderPage);