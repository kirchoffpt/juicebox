import React, { Component } from 'react';
import Visualizer from './Visualizer';

class AudioData extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.freqBands = [...Array(25).keys()]
    }

    initialize = () => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(this.props.mediaStream);
        const analyser = audioContext.createAnalyser();
        source.connect(audioContext.destination);
        source.connect(analyser);
    }

    render() {
        return (
            <div>
                <Visualizer>
                    initialize={this.initialize}
                    freqBands={this.freqBands};
                    mediaStream={this.mediaStream};
                </Visualizer>
            </div>
        )
    }
}

export default AudioData;