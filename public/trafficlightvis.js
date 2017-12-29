import './trafficlightvis.css';

import mainTemplate from './trafficlightvis.html';
import optionsTemplate from './trafficlightvisparams.html';
import './trafficlightviscontroller.js';

import {CATEGORY} from 'ui/vis/vis_category';
import {VisFactoryProvider} from 'ui/vis/vis_factory';
import {VisTypesRegistryProvider} from 'ui/registry/vis_types';
import {VisSchemasProvider} from 'ui/vis/editors/default/schemas';

function TestVisProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const Schemas = Private(VisSchemasProvider);

  return VisFactory.createAngularVisualization({
    name: 'trafficlights',
    title: 'Traffic Lights',
    icon: 'fa fa-car',
    description: 'Great for one-glance status readings, the traffic light visualization expresses in green / yellow / red the position of a single value in relation to low and high thresholds.',
    category: CATEGORY.OTHER,
    //visualization: VisController,

    visConfig: {
      defaults: {
        max: 1000000,
        width: 50,
        redThreshold: 20,
        greenThreshold: 80,
        invertScale: false,
        numberOfLights: 10
      },
      template: mainTemplate
    },
    editorConfig: {
      optionsTemplate: optionsTemplate,
      schemas: new Schemas([{
        group: 'metrics',
        name: 'metric',
        title: 'Metric',
        min: 1,
        aggFilter: ['!derivative', '!geo_centroid'],
        defaults: [{
          type: 'count',
          schema: 'metric'
        }]
      }, {
        group: 'buckets',
        name: 'segment',
        title: 'Bucket Split',
        min: 0,
        max: 1,
        aggFilter: ['!geohash_grid', '!filter']
      }]),
    }
  });
}
VisTypesRegistryProvider.register(TestVisProvider);