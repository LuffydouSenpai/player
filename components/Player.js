/* eslint-disable prettier/prettier */
import React,{ Component } from 'react';
import { StyleSheet, View, Text, Animated} from 'react-native';
import { playlist } from '../playlist';
import NavBtn from './NavBtn';
import Sound from 'react-native-sound';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Slider from '@react-native-community/slider';


class Player extends Component {
    constructor(props){
        super(props);
        Sound.setCategory('Playback');
    }

    state = {
        currentTrack:0,
        playlist:playlist,
        playPause: true,
        gestureName: 'none',
        tranxAnim: new Animated.Value(1),
        timeManager:'00:00',
        totalTime:'00:00',
    }

    mp3 = this.initSound();
    initSound(index = this.state.currentTrack){
        Sound.setCategory('Playback');
        const sound = new Sound(this.state.playlist[index].mp3, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
                // loaded successfully
                console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
                this.setState({totalTime:this.fancyTimeFormat(sound.getDuration())});
                this.time();
        });
        return sound;
    }

    playMp3(){
      let playPauseTMP = !this.state.playPause;
        this.setState({playPause: playPauseTMP});
        console.log('playlist');
        console.dir(this.mp3);

        if (this.state.playPause){
             this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.mp3.setCurrentTime(0);
                    this.next();
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        } else {
            // pause
            this.mp3.pause();
        }

    }

    prev(){
        this.setState({playPause:false});
        this.mp3.pause();
        this.mp3.release();
        let index;
        if (this.state.currentTrack === 0){
            index = this.state.playlist.length - 1;
        } else {
            index = this.state.currentTrack - 1;
        }
        this.transOut(index);
        this.mp3 = this.initSound(index);
        setTimeout(()=>{
            this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.mp3.setCurrentTime(0);
                    this.next();
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        },100);
    }

    next(){
        this.setState({playPause:false});
        this.mp3.pause();
        this.mp3.release();
        let index;
        if (this.state.currentTrack === this.state.playlist.length - 1){
            index = 0;
        } else {
            index = this.state.currentTrack + 1;
        }
        this.transOut(index);
        this.mp3 = this.initSound(index);
        setTimeout(()=>{
            this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.mp3.setCurrentTime(0);
                    this.next();
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        },100);
    }

    fancyTimeFormat(duration)
    {
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    time(){
        setInterval(()=>{
            this.mp3.getCurrentTime(
                (seconds)=>{
                    console.log(seconds);
                    this.setState({timeManager:this.fancyTimeFormat(seconds)});
                }
            );
        },1000);

    }
    // gestion swip

      onSwipeLeft(gestureState) {
        this.next();
        this.setState({myText: 'You swiped left!'});
      }
     
      onSwipeRight(gestureState) {
        this.prev();
        this.setState({myText: 'You swiped right!'});
      }
     
      onSwipe(gestureName, gestureState) {
        const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        this.setState({gestureName: gestureName});
      }

    transOut(index){
        // Will change fade Anim value to a1 in 5 seconds
        Animated.timing(this.state.tranxAnim, {
            toValue:0,
            duration:1000,
        }).start(()=>{
            this.setState({currentTrack: index});
            this.transIn();
        });
    }
    transIn(){
        Animated.timing(this.state.tranxAnim, {
            toValue:1,
            duration:1000,
        }).start(()=>{
            console.log('animation out et in ternimée')
        })
    }

    render(){
        return(
            <View style={this.styles.container}>
            <Text style={this.styles.nbrMusique}>PLAYING {this.state.currentTrack+1} OF {this.state.playlist.length}</Text>
                <GestureRecognizer
                    onSwipe={(direction, state) => this.onSwipe(direction, state)}
                    onSwipeLeft={(state) => this.onSwipeLeft(state)}
                    onSwipeRight={(state) => this.onSwipeRight(state)}
                >
                    <Animated.Image source={{ uri: 'asset:/img/cover/' + this.state.playlist[this.state.currentTrack].cover }}
                        style={[this.styles.image,{
                            opacity: this.state.tranxAnim,
                        }
                    ]}
                    />
                </GestureRecognizer>
                <Text style={this.styles.titre}>{this.state.playlist[this.state.currentTrack].title}</Text>
                <Text style={this.styles.description}>{this.state.playlist[this.state.currentTrack].description}</Text>
                <Text style={this.styles.info}> Artiste : {this.state.playlist[this.state.currentTrack].artist} | Genre : {this.state.playlist[this.state.currentTrack].genre} | Année : {this.state.playlist[this.state.currentTrack].annee}</Text>
                <View style={this.styles.navigation}>
                    <NavBtn action={()=>{this.prev()}} icone={'/img/backward-step-solid.png'}/>
                    <NavBtn action={()=>{this.playMp3()}} icone={ this.state.playPause ? '/img/play-solid.png' : '/img/pause-solid.png'}/>
                    <NavBtn action={()=>{this.next()}} icone={'/img/forward-step-solid.png'}/>
                </View>
                <View style={this.styles.navigation}>
                    <Text>{this.state.timeManager}</Text>
                    <Slider 
                        style={{width: 200, height: 25}}
                        minimumValue={0}
                        maximumValue={100}
                    />
                    <Text>{this.state.totalTime}</Text>
                </View>
            </View>
        )
    }

    styles = StyleSheet.create({
        image: {
          height:250,
          width:250,
        },
        container: {
            height:'100%',
            width:'100%',
            alignItems: 'center',
            backgroundColor: 'purple',
          },
        navigation:{
            flexDirection:'row',
        },
        nbrMusique:{
            marginBottom: 12,
            marginTop: 12,
            fontSize: 20,
        },
        titre:{
            fontSize:36,
        },
        description:{
            fontSize:18,
        },
        info:{
            fontSize:13,
        },
      });
}
export default Player;