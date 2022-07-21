/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Image, TouchableHighlight } from "react-native";


const NavBtn = (props) => {
    return (
        <TouchableHighlight style={styles.contaner} onPress={props.action}>
            <Image source={{uri: 'asset:' + props.icone}}
                style={styles.imgIcone}
            />
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    contaner:{
        width:50,
        height:50,
        margin:10,
    },
    imgIcone: {
        width: '100%',
        height:'100%',
    },
  });

export default NavBtn;