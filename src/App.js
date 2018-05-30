/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, { Component } from 'react';
import Globe from 'worldwind-react-globe';
import { observer } from "mobx-react";

import NavBar from './components/NavBar';
import NavItem from './components/NavItem';
import SearchBox from './components/SearchBox';
import Tools from './components/Tools';
import Layers from './components/Layers';
import Books from './components/Books';
import Markers from './components/Markers';
import Settings from './components/Settings';
import WmsCatalog from './api/WmsCatalog';
import './App.css';

/* global WorldWind */

const MARKERS_LAYER='Markers';

const App = observer(class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseLayers: {layers: [], lastUpdated: Date.now()},
      overlayLayers: {layers: [], lastUpdated: Date.now()},
      settingLayers: {layers: [], lastUpdated: Date.now()},
      debugLayers: {layers: [], lastUpdated: Date.now()}
    };

    this.oldTest = new Map();
    this.oldTest.set('Genesis', {kml: 'gen.kml'});
    this.oldTest.set('Exodus', {kml: 'exod.kml'});
    this.oldTest.set('Leviticus', {kml: 'lev.kml'});
    this.oldTest.set('Numbers', {kml: 'num.kml'});
    this.oldTest.set('Deuteronomy', {kml: 'duet.kml'});
    this.oldTest.set('Joshua', {kml: 'josh.kml'});
    this.oldTest.set('Judges', {kml: 'judg.kml'});
    this.oldTest.set('Ruth', {kml: 'ruth.kml'});
    this.oldTest.set('1 Samuel', {kml: '1sm.kml'});
    this.oldTest.set('2 Samuel', {kml: '2sam.kml'});
    this.oldTest.set('1 Kings', {kml: '1kgs.kml'});
    this.oldTest.set('2 Kings', {kml: '2kgs.kml'});
    this.oldTest.set('1 Chronicles', {kml: '1chr.kml'});
    this.oldTest.set('2 Chronicles', {kml: ''});
    this.oldTest.set('Ezra', {kml: 'esra.kml'});
    this.oldTest.set('Nehemiah', {kml: 'neh.kml'});
    this.oldTest.set('Esther', {kml: 'esth.kml'});
    this.oldTest.set('Job', {kml: 'job.kml'});
    this.oldTest.set('Psalms', {kml: 'ps.kml'});
    this.oldTest.set('Proverbs', {kml: ''});
    this.oldTest.set('Ecclesiastes', {kml: 'eccl.kml'});
    this.oldTest.set('Song of Solomon', {kml: 'song.kml'});
    this.oldTest.set('Isaiah', {kml: 'isa.kml'});
    this.oldTest.set('Jeremiah', {kml: 'jer.kml'});
    this.oldTest.set('Lamentations', {kml: 'lam.kml'});
    this.oldTest.set('Ezekiel', {kml: 'ezek.kml'});
    this.oldTest.set('Daniel', {kml: 'dan.kml'});
    this.oldTest.set('Hosea', {kml: 'hos.kml'});
    this.oldTest.set('Joel', {kml: 'joel.kml'});
    this.oldTest.set('Amos', {kml: 'amos.kml'});
    this.oldTest.set('Obadiah', {kml: 'obad.kml'});
    this.oldTest.set('Jonah', {kml: 'jonah.kml'});
    this.oldTest.set('Micah', {kml: 'mic.kml'});
    this.oldTest.set('Nahum', {kml: 'nah.kml'});
    this.oldTest.set('Habakkuk', {kml: 'hab.kml'});
    this.oldTest.set('Zephaniah', {kml: 'zeph.kml'});
    this.oldTest.set('Haggai', {kml: 'hag.kml'});
    this.oldTest.set('Zechariah', {kml: 'zech.kml'});
    this.oldTest.set('Malachi', {kml: 'mal.kml'});

    this.newTest = new Map();
    this.newTest.set('Matthew', {kml: 'matt.kml'});
    this.newTest.set('Mark', {kml: 'mark.kml'});
    this.newTest.set('Luke', {kml: 'luke.kml'});
    this.newTest.set('John', {kml: 'john.kml'});
    this.newTest.set('Acts (of the Apostles)', {kml: 'acts.kml'});
    this.newTest.set('Romans', {kml: 'rom.kml'});
    this.newTest.set('1 Corinthians', {kml: '1cor.kml'});
    this.newTest.set('2 Corinthians', {kml: '2cor.kml'});
    this.newTest.set('Galatians', {kml: 'gal.kml'});
    this.newTest.set('Ephesians', {kml: 'eph.kml'});
    this.newTest.set('Philippians', {kml: 'phil.kml'});
    this.newTest.set('Colossians', {kml: 'col.kml'});
    this.newTest.set('1 Thessalonians', {kml: '1thess.kml'});
    this.newTest.set('2 Thessalonians', {kml: ''});
    this.newTest.set('1 Timothy', {kml: '1tim.kml'});
    this.newTest.set('2 Timothy', {kml: '2tim.kml'});
    this.newTest.set('Titus', {kml: 'titus.kml'});
    this.newTest.set('Philemon', {kml: 'phil.kml'});
    this.newTest.set('Hebrews', {kml: 'heb.kml'});
    this.newTest.set('James', {kml: ''});
    this.newTest.set('1 Peter', {kml: '1pet.kml'});
    this.newTest.set('2 Peter', {kml: '2pet.kml'});
    this.newTest.set('1 John', {kml: ''});
    this.newTest.set('2 John', {kml: ''});
    this.newTest.set('3 John', {kml: ''});
    this.newTest.set('Jude', {kml: 'jude.kml'});
    this.newTest.set('Revelation', {kml: 'rev.kml'});
           
    // Holds a reference to the Map component after mounting
    this.globeRef = React.createRef();
    this.markersRef = React.createRef();
    this.globe = null;

    // Specify the location to the images folder used by WorldWind 
    Globe.setBaseUrl('./');
  }

  /**
   * A property function used to lift state up from the Map into the App.
   * 
   * @param {Object} data An object to be merged into the App's state.
   */
  onGlobeUpdate(data) {
    this.setState(data);
  }

  componentDidMount() {
    // Get the component with the WorldWindow after mounting
    this.globe = this.globeRef.current;

    let layers = [
      {layer: "Blue Marble", options: {category: "base", enabled: false}},
      {layer: "LandSat", options: {category: "base", enabled: false}},
      {layer: "Bing Aerial", options: {category: "base", enabled: false}},
      {layer: "Bing Aerial with Labels", options: {category: "base", enabled: false}},
      {layer: "Sentinal2", options: {category: "base", enabled: false}},
      {layer: "Sentinal2 with Labels", options: {category: "base", enabled: true}},
      {layer: "Bing Roads", options: {category: "base", enabled: false}},
      {layer: "OpenStreetMap", options: {category: "base", enabled: false}},
      {layer: new WorldWind.RenderableLayer(MARKERS_LAYER), options: {category: "data", enabled: true}},
      {layer: "Compass", options: {category: "setting", enabled: false}},
      {layer: "Coordinates", options: {category: "setting", enabled: true}},
      {layer: "View Controls", options: {category: "setting", enabled: true}},
      {layer: "Stars", options: {category: "setting", enabled: false, displayName: "Stars"}},
      {layer: "Atmosphere", options: {category: "setting", enabled: false}},
      {layer: "Tessellation", options: {category: "debug", enabled: false}}
    ];
    for (let config of layers) {
      this.globe.addLayer(config.layer, config.options);
    }
    
    // Callback to add book KML to the overlays
    let addBook = (book) => {
      let title = book[0];
      let kml = './openbibleinfo/books/' + book[1].kml;
      let layer = new WorldWind.RenderableLayer(title);
      this.globe.addLayer(layer,  {category: "overlay", enabled: false});
      
      let kmlFilePromise = new WorldWind.KmlFile(kml);
      kmlFilePromise.then(function(kmlFile) {
          layer.addRenderable(kmlFile);
      });
    };
    Array.from(this.oldTest).reverse().forEach(addBook);
    Array.from(this.newTest).reverse().forEach(addBook);
  }

  /**
   * Renders the globe and the panels that render the globe's contents.
   * The Globe element/component sets the primaryGlobe reference used
   * by the panels.
   */
  render() {
    
    const navbarItems = [
      <NavItem key='1' title="Layers" icon="list" href="#layers"/>,
      //<NavItem key='2' title="Books" icon="book" href="#books"/>,
      <NavItem key='3' title="Markers" icon="map-marker" href="#markers"/>,
      <NavItem key='4' title="Settings" icon="cog" href="#settings"/>
    ];
    const navbarSearch = <SearchBox globe={this.globe}/>;

    return (
        <div>
            <NavBar 
                title='Bible Atlas'
                logo='./images/mapicons/cross-2.png'
                href='https://github.com/emxsys/bible-atlas'
                items={navbarItems}
                search={navbarSearch} />
            <div className="App container-fluid p-0">
                <div className="globe">
                    <Globe 
                        ref={this.globeRef} 
                        latitude={31.78}
                        longitude={35.24}
                        altitude={1e6}
                        onUpdate={this.onGlobeUpdate.bind(this)} />
                </div>
                <div className="overlayTools noninteractive">
                    <Tools 
                        globe={this.globeRef.current} 
                        markers={this.markersRef.current}
                        markersLayerName="Markers"/>
                </div>
                <div className="overlayCards noninteractive">
                    <div className="card-columns">
                        <div id="layers" className="collapse interactive">
                            <Layers
                                baseLayers={this.state.baseLayers} 
                                overlayLayers={this.state.overlayLayers} 
                                globe={this.globe} />
                        </div>
                        <div id="books" className="collapse interactive">
                            <Books 
                                globe={this.globeRef.current} 
                                oldTest={this.oldTest}
                                newTest={this.newTest}/>
                        </div>
                        <div id="markers" className="collapse interactive">
                            <Markers 
                                ref={this.markersRef}
                                globe={this.globeRef.current}
                                markersLayerName={MARKERS_LAYER} />
                        </div>
                        <div id="settings" className="collapse interactive">
                            <Settings
                                settingLayers={this.state.settingLayers} 
                                debugLayers={this.state.debugLayers} 
                                globe={this.globe} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
  }
});

export default App;
