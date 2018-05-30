/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Globe from 'worldwind-react-globe';

/* global WorldWind */

/**
 * Renders a button for toggling the enabled state of a WorldWind.Layer.
 * Expects a layer={WorldWind.Layer} property assignment.
 * @type type
 */
export default class LayerButton extends Component {
    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }
    
    static propTypes = {
        layer: PropTypes.instanceOf(WorldWind.Layer).isRequired,
        globe: PropTypes.instanceOf(Globe).isRequired
    }   

    onClickHandler(e) {
        this.props.globe.toggleLayer(this.props.layer);
    }

    render() {
        const buttonClass = "list-group-item list-group-item-action p-2"
            + (this.props.enabled ? " active" : "");

        return (
            <button 
                type="button" 
                className={buttonClass} 
                onClick={this.onClickHandler}>
                {this.props.layer.displayName}
            </button>
            );
    }
};

