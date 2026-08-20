import * as Blockly from 'blockly';

const soar_wme_condition = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('WorkingMemoryElement')
      .setCheck('HardwareInput')
      .appendField('If');
    this.appendDummyInput('Operator')
      .appendField(new Blockly.FieldDropdown([
        ['Equals', '=='],
        ['Not Equal', '!='],
        ['Greater Than', '>'],
        ['Less Than', '<'],
      ]), 'Operator');
    this.appendValueInput('Value')
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck('HardwareState');
    this.setPreviousStatement(true, 'soar_wme_condition');
    this.setNextStatement(true, 'soar_wme_condition');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(90);
  },
};

const soar_state_check = {
  init: function(this: Blockly.Block) {
    this.appendValueInput('agent_state')
    .setCheck('agent_state')
      .appendField('Agent Current State is');
    this.setPreviousStatement(true, 'soar_wme_condition');
    this.setNextStatement(true, 'soar_wme_condition');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(90);
  }
};

const soar_propose_operator = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput('propose_operator_name')
      .appendField('Proposal:')
      .appendField(new Blockly.FieldTextInput('ProposalName'), 'propose_operator_name');
    this.appendStatementInput('LHS')
    .setAlign(Blockly.inputs.Align.RIGHT)
    .setCheck('soar_wme_condition')
      .appendField('When:');
    this.appendStatementInput('RHS')
    .setAlign(Blockly.inputs.Align.RIGHT)
    .setCheck('apply_operator')
      .appendField('Set Applications:');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(225);
  }
};

const soar_apply_rule = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput('apply_operator_name')
      .appendField('Application Name:')
      .appendField(new Blockly.FieldTextInput('ApplicationName'), 'apply_operator_name');
    this.appendStatementInput('apply_operator_conditions')
    .setCheck('action')
      .appendField('If:');
    this.appendStatementInput('apply_operator_actions')
    .setCheck('action')
      .appendField('Then:');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(0);
  }
};

const soar_set_output = {
  init: function(this: Blockly.Block) {
    this.appendValueInput('hardware_input')
    .setCheck('HardwareInput')
      .appendField('Set Subsystem');
    this.appendValueInput('hardware_state')
    .setCheck('HardwareState')
      .appendField('State to:');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(270);
  }
};

const hardware_state = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput('state_holder')
      .appendField('Hardware State:')
      .appendField(new Blockly.FieldTextInput('OPEN'), 'state');
    this.setOutput(true, 'HardwareState');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(180);
  }
};

const hardware_input = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput('hardware_input_holder')
      .appendField('Hardware Input:')
      .appendField(new Blockly.FieldDropdown([
          ['CLAW', 'Claw'],
          ['ARM', 'Arm'],
          ['DRIVE_BASE', 'DriveBase']
        ]), 'hardware_input');
    this.setOutput(true, 'HardwareInput');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(100);
  }
};

Blockly.common.defineBlocks(
    {
        soar_state_check: soar_state_check,
        soar_wme_condition: soar_wme_condition,
        soar_propose_operator: soar_propose_operator,
        soar_apply_rule: soar_apply_rule,
        soar_set_output: soar_set_output,
        hardware_state: hardware_state,
        hardware_input: hardware_input
    }
);


export const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    {
      kind: 'block',
      type: 'soar_wme_condition',
    },
    {
      kind: 'block',
      type: 'soar_state_check',
    },
    {
        kind: 'block',
        type: 'soar_propose_operator'
    },
    {
        kind: 'block',
        type: 'soar_apply_rule'
    },
    {
        kind: 'block',
        type: 'soar_set_output'
    },
    {
        kind: 'block',
        type: 'hardware_state'
    },
    {
        kind: 'block',
        type: 'hardware_input'
    }
  ]
};