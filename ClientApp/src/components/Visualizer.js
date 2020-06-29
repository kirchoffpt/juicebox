import React, { useRef, Component }  from 'react';
import Paper from '@material-ui/core/Paper';
//import '../stylesheets/App.scss';

export class Visualizer extends Component {

    constructor(props) {
        super(props);
        this.freqBandArray = new Uint8Array(32);
        this.runSpectrum = this.runSpectrum.bind(this);
      }

    runSpectrum(){
      this.freqBandArray = this.props.getFrequencyData();
      requestAnimationFrame(this.runSpectrum);
      this.forceUpdate();
    }

    componentDidMount(){
        this.runSpectrum();
    }

    render(){

        var freqArray = Array.from(this.freqBandArray);
        if(!freqArray) freqArray = Array.from(new Uint8Array(32));
        var key = 0;
        return (

        <div>
            <div className="flex-container" style={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'flex-start',
                height : '100px',
                paddingTop: '10%'}}>
            {freqArray.map((num) =>
                <Paper
                className='frequencyBands'
                elevation={4}
                key={key++}
                style={{
                    height : num.toString() + 'px',
                    backgroundColor : 'rgb(' +num.toString() + ',' + (117-num/3).toString() + ',216)',
                    paddingBottom : 0,
                }}
                />
            )}
            </div>

        </div>

        );
    }

}