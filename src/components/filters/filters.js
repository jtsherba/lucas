import content from './filters.html';
import { triggerEvent } from './../../helpers/utils';
import projects from './../../helpers/project-details';

const model = {};

let filtersContainer;
let projectId;
let details;
let projectSelect;
let scenarioSelect;
let secStratumSelect;
let stratumSelect;
let iterationInput;

function removeOptions(selectbox) {
  for (let i = 0; i < selectbox.options.length; i++) {
    if (selectbox.options[i].value !== 'All') {
      selectbox.remove(i);
    }
  }
}

function updateIterationInput() {
  const id = scenarioSelect.value;
  const scenarioDetail = details.scenario.find((item) => item.id === id);
  iterationInput.max = scenarioDetail.iterations;
}


function updateFields() {
  projectId = this.options[this.selectedIndex].value;
  details = projects.getDetailsForId(projectId).details;

  if (details) {
    // Populate scenario select box
    scenarioSelect = filtersContainer.querySelector('select[name=scenario]');
    removeOptions(scenarioSelect);
    details.scenario.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.id;
      scenarioSelect.add(option);
    });
    scenarioSelect.disabled = false;

    // Populate secondary stratum select box
    secStratumSelect = filtersContainer.querySelector('select[name=secondary_stratum]');
    removeOptions(secStratumSelect);
    details.secondary_stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      secStratumSelect.add(option);
    });
    secStratumSelect.disabled = false;

    // Populate stratum select box
    stratumSelect = filtersContainer.querySelector('select[name=stratum]');
    removeOptions(stratumSelect);
    details.stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      stratumSelect.add(option);
    });
    stratumSelect.disabled = false;

    // Populate iteration input box
    iterationInput = filtersContainer.querySelector('input[name=iteration]');
    iterationInput.disabled = false;
  }
}

model.init = () => {
  // Initialize container
  filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = content;

  // Add list of projects to content
  projectSelect = filtersContainer.querySelector('select[name=project]');

  projects.getList().forEach((project) => {
    const option = document.createElement('option');
    option.text = project;
    option.value = project;
    projectSelect.add(option);
  });

  projectSelect.onchange = updateFields;
  projectSelect.onchange();

  scenarioSelect.onchange = updateIterationInput;
  scenarioSelect.onchange();

  // Create a custom event that is dispatched when Update button on form is clicked
  const form = filtersContainer.querySelector('form');

  form.onsubmit = function (e) {
    // prevent default
    e.preventDefault();
    // dispatch custom event
    triggerEvent(document, 'filters.change', {
      detail: model.getValues()
    });
  };
  triggerEvent(document, 'filters.change', {
    detail: model.getValues()
  });
};

model.getValues = () => (
  {
    project: projectSelect.value,
    scenario: scenarioSelect.value,
    stratum: stratumSelect.value,
    secondary_stratum: secStratumSelect.value,
    iteration: iterationInput.value,
  }
);

export default model;
