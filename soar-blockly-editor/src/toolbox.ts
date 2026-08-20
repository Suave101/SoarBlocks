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

Blockly.common.defineBlocks(
    {
        soar_state_check: soar_state_check,
        soar_wme_condition: soar_wme_condition,
        soar_propose_operator: soar_propose_operator,
        soar_apply_rule: soar_apply_rule
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
    }
  ]
};