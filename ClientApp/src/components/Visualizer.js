import React, { Component }  from 'react';
import Paper from '@material-ui/core/Paper';
//import '../stylesheets/App.scss';

export class Visualizer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            freqArray : new Uint8Array(32),
        };
        this.runSpectrum = this.runSpectrum.bind(this);
      }

    runSpectrum(){
      this.setState({freqArray : this.props.getFrequencyData()});
      requestAnimationFrame(this.runSpectrum);
      //this.forceUpdate();
    }

    componentDidMount(){
        this.runSpectrum();
    }

    render(){

        var freqArray = Array.from(this.state.freqArray, x => x/2);
        freqArray = freqArray.splice(6,48);
        if(!freqArray) freqArray = Array.from(new Uint8Array(32));
        var key = 0;
        return (

        <div style={{marginBottom : '0', height : '50px'}}>
            <div className="flex-container" style={{
                display: 'flex',
                flexWrap: 'nowrap',
                //justifyContent: 'center',
                alignItems: 'stretch',
                height : '50px',
                paddingBottom : '0',
                marginBottom : '0',
                //paddingTop: '100%',
            }}>
            {freqArray.map((num) =>
                <Paper
                className='frequencyBands'
                elevation={4}
                key={key++}
                style={{
                    height : Math.min(num,140).toString() + 'px',
                    backgroundColor : 'rgb(2,'+(num*2.5-20)+',212)',
                    paddingBottom : '0',
                }}
                />
            )}
            </div>

        </div>

        );
    }

}