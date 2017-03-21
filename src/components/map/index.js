// Import Node modules
import L from 'leaflet';

import 'leaflet.sync'
// Import Styles
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

// Import helpers
import { cartoDBPositronLabelsOnly, stateclassTiles } from './../../helpers/leaflet-layers';
import projects from './../../helpers/project-details';

/**
* EXPORT VARIABLE
**/
const model = {};


/**
* PRIVATE VARIABLES
**/
let map;
let mapContainer;
let settings;
let feature;
let tempLayer;
const info = L.control();
info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
info.update = function (year) {
  this._div.innerHTML = year || 2001;
};

/**
* PRIVATE FUNCTIONS
**/
function leftPad(val = 1, length = 4) {
  const str = val.toString();
  return `${'0'.repeat(length - str.length)}${str}`;
}

function createMapVariables(input){
  var accounts = [];

  for (var i = 0; i < input.length; i++) {
      accounts[i] = "whatever";
  }

  return accounts;
}

function pairs(arr) {
      var res = [],
        l = arr.length;
      for(var i=0; i<l; ++i)
        for(var j=i+1; j<l; ++j)
          res.push([arr[i], arr[j]]);
      return res;
}
/**
* PUBLIC FUNCTIONS
**/
model.init = ({ selector, lat = 22.234262, lng = -159.784857, scenario = '6368', iteration = '1', year = '2001' }) => {
  // Initialize container
  if (!selector) {
    mapContainer = document.getElementById('map');
  } else {
    mapContainer = selector;
  }

  // Intialize Map object
  map = L.map(mapContainer, {
    center: [lat, lng],
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    attributionControl: true,
    touchZoom: false,
    scrollWheelZoom: false,
    layers: [stateclassTiles, cartoDBPositronLabelsOnly],
  });

  settings = {
    year: year.toString(),
    scenario: scenario.toString(),
    iteration: iteration.toString(),
    secondary_stratum: '',
  };

  info.addTo(map);

};



model.updateRaster = (...args) => {
 
  let update = false;
  if (args && args[0]) {
    if (args[0].year && args[0].year !== settings.year) {
      settings.year = args[0].year;
      update = true;
    }
    if (args[0].scenario && args[0].scenario !== settings.scenario) {
      settings.scenario = args[0].scenario;
      update = true;
    }
    if (args[0].iteration && args[0].iteration !== settings.iteration) {
      settings.iteration = args[0].iteration;
      update = true;
    }
    if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
      settings.secondary_stratum = args[0].secondary_stratum;
      const project = projects.getDetailsForId(args[0].project);
      const feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
      if (feature.geom) {
        const tempLayer = L.geoJson(feature.geom);
        map.fitBounds(tempLayer.getBounds());
      }
      update = true;
    }
  }

  if (update) {
    //console.log(leftPad(settings.iteration))
    //const url = `http://stage.landcarbon.org/tiles/s${settings.scenario}-it${leftPad(settings.iteration)}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
    const url = `http://stage.landcarbon.org/tiles/s${settings.scenario}-it${'0001'}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
    info.update(settings.year);
    stateclassTiles.setUrl(url);
   

  }
};


model.reloadMap = (...args) => {
  
  let update = false;
  if (args && args[0]) {
    if (args[0].year && args[0].year !== settings.year) {
      settings.year = args[0].year;
      update = true;
    }
    if (args[0].scenario && args[0].scenario !== settings.scenario) {
      settings.scenario = args[0].scenario;
      update = true;
    }
    if (args[0].iteration && args[0].iteration !== settings.iteration) {
      settings.iteration = args[0].iteration;
      update = true;
    }
    if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
      settings.secondary_stratum = args[0].secondary_stratum;
      const project = projects.getDetailsForId(args[0].project);
      feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
      if (feature.geom) {
        tempLayer = L.geoJson(feature.geom);
        map.fitBounds(tempLayer.getBounds());
      }
      update = true;
    }
  }
  console.log(feature)
 console.log(tempLayer)
console.log(update)

if (update) {


 d3.selectAll("#map > *").remove();
  mapContainer = document.getElementById('map');
  
 // mapContainer.remove();

  scenarios = args[0].scenario.split(',')
  //console.log(scenarios)
  maps = createMapVariables(scenarios)
  

  for (i = 0; i < maps.length; i++) {
  
    var id = "map_"+ i.toString();
    var test = "test_"+ i.toString();
    var m = document.createElement('div')
    m.className="map"
    m.id=id
    m.style.background = 'white';
    if (maps.length >1 && maps.length <3){
      m.style.height = "50%"
      m.style.width = "100%"
    }else if (maps.length >=3){
      m.style.height = "50%"
      m.style.width = "50%"
     
    }else{
       m.style.height = "100%"
      m.style.width = "100%"
    }
  
  mapscenario = scenarios[i]

  mapContainer.appendChild(m)
  
  maps[i] =  L.map(id, {
      center: ["22.234262", "-159.784857"],
      zoom: 9,
      minZoom: 5,
      maxZoom: 18,
      attributionControl: true,
      touchZoom: false,
      scrollWheelZoom: false,
      //layers: [cartoDBPositronLabelsOnly,],
      });
    
  L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
          attribution: 'Stamen'
        }).addTo(maps[i]);
    
  const url = `http://stage.landcarbon.org/tiles/s${mapscenario}-it${'0001'}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
    info.update(settings.year);
   // stateclassTiles.setUrl(url);
    L.tileLayer(url, {
          attribution: 'USGS'
        }).addTo(maps[i]);

    if (feature.geom) {
        maps[i].fitBounds(tempLayer.getBounds());
    }
      
  }
  pairs(maps).forEach(function(pair){
      pair[0].sync(pair[1])
      pair[1].sync(pair[0])
    });

 
  // Intialize Map object
 

  
    //console.log(leftPad(settings.iteration))
    //const url = `http://stage.landcarbon.org/tiles/s${settings.scenario}-it${leftPad(settings.iteration)}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
    
   

  }

};

export default model;
