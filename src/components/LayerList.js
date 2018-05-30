/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Globe from 'worldwind-react-globe';

import LayerButton from './LayerButton';

export default class LayerList extends Component {
    static propTypes = {
        layers: PropTypes.array.isRequired,
        globe: PropTypes.instanceOf(Globe)
    }   

    render() {
        // Create a list of items for React to render; 
        // each item must have a unique key
        let layerElements = this.props.layers.map((layer) =>
            <LayerButton key={layer.uniqueId} layer={layer} enabled={layer.enabled} globe={this.props.globe} />
        );
        // Reverse the layers so the top-most layer is displayed first
        layerElements.reverse();

        return (
            <div className="list-group">{layerElements}</div>
            );
    }
};
