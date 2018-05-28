import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Globe from 'worldwind-react-globe';
import FontAwesome from 'react-fontawesome';

import LayerList from './LayerList';

export default class Settings extends Component {
        
    static propTypes = {
        settingLayers: PropTypes.object.isRequired,
        debugLayers: PropTypes.object.isRequired,
        globe: PropTypes.instanceOf(Globe)
    } 
    
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">
                        <FontAwesome name='cog'/> Settings
                        <button type="button" className="close pull-right" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </h5>
                </div>
                <div className="card-body">
                    <LayerList layers={this.props.settingLayers.layers} globe={this.props.globe}/>
                    <br/>
                    <LayerList layers={this.props.debugLayers.layers} globe={this.props.globe}/>
                </div>
            </div>
        );
    }
}

