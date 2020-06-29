import React, { useRef, Component }  from 'react';
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

        var freqArray = Array.from(this.state.freqArray);
        if(!freqArray) freqArray = Array.from(new Uint8Array(32));
        var key = 0;
        return (

        <div style={{marginBottom : '0', height : '100px'}}>
            <div className="flex-container" style={{
                display: 'flex',
                flexWrap: 'nowrap',
                //justifyContent: 'center',
                alignItems: 'stretch',
                height : '100px',
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
                    height : num.toString() + 'px',
                    backgroundColor : 'rgb(' +num.toString() + ',' + (117-num/3).toString() + ',216)',
                    paddingBottom : '0',
                }}
                />
            )}
            </div>

        </div>

        );
    }

}