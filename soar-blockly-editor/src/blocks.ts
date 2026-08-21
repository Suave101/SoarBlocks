import * as Blockly from 'blockly';

const TYPE_CONDITION = 'Condition';
const TYPE_APPLY_RULE = 'ApplyRule';
const TYPE_ACTION = 'Action';
const TYPE_HARDWARE_INPUT = 'HardwareInput';
const TYPE_HARDWARE_STATE = 'HardwareState';
const TYPE_PREFERENCE = 'Preference';

export const soar_wme_condition = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('WorkingMemoryElement')
      .setCheck(TYPE_HARDWARE_INPUT)
      .appendField('If');
    this.appendDummyInput('Operator')
      .appendField(
        new Blockly.FieldDropdown([
          ['Equals', '=='],
          ['Not Equal', '!='],
          ['Greater Than', '>'],
          ['Less Than', '<'],
        ]),
        'Operator'
      );
    this.appendValueInput('Value')
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck(TYPE_HARDWARE_STATE);
    this.setPreviousStatement(true, TYPE_CONDITION);
    this.setNextStatement(true, TYPE_CONDITION);
    this.setTooltip('Matches a Working Memory Element condition');
    this.setColour(90);
  },
};

export const soar_state_check = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput('agent_state_input')
      .appendField('Agent Current State is')
      .appendField(new Blockly.FieldTextInput('AUTONOMOUS'), 'agent_state');
    this.setPreviousStatement(true, TYPE_CONDITION);
    this.setNextStatement(true, TYPE_CONDITION);
    this.setTooltip('Checks current high-level agent operating state');
    this.setColour(90);
  },
};

export const soar_propose_operator = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput('propose_operator_name')
      .appendField('Proposal:')
      .appendField(
        new Blockly.FieldTextInput('ProposalName'),
        'propose_operator_name'
      );
    this.appendStatementInput('LHS')
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck(TYPE_CONDITION)
      .appendField('When:');
    this.appendStatementInput('RHS')
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck(TYPE_APPLY_RULE)
      .appendField('Set Applications:');
    this.setTooltip('Proposes an operator when LHS conditions are met');
    this.setColour(225);
  },
};

export const soar_apply_rule = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput('apply_operator_name')
      .appendField('Application Name:')
      .appendField(
        new Blockly.FieldTextInput('ApplicationName'),
        'apply_operator_name'
      );
    this.appendStatementInput('apply_operator_conditions')
      .setCheck(TYPE_CONDITION)
      .appendField('If:');
    this.appendStatementInput('apply_operator_actions')
      .setCheck(TYPE_ACTION)
      .appendField('Then:');
    this.setPreviousStatement(true, TYPE_APPLY_RULE);
    this.setNextStatement(true, TYPE_APPLY_RULE);
    this.setTooltip('Applies specific output actions when conditions match');
    this.setColour(0);
  },
};

export const soar_set_output = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('hardware_input')
      .setCheck(TYPE_HARDWARE_INPUT)
      .appendField('Set Subsystem');
    this.appendValueInput('hardware_state')
      .setCheck(TYPE_HARDWARE_STATE)
      .appendField('State to:');
    this.setPreviousStatement(true, TYPE_ACTION);
    this.setNextStatement(true, TYPE_ACTION);
    this.setTooltip('Sets a hardware subsystem setpoint');
    this.setColour(270);
  },
};

export const hardware_state = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput('state_holder')
      .appendField('Hardware State:')
      .appendField(new Blockly.FieldTextInput('OPEN'), 'state');
    this.setOutput(true, TYPE_HARDWARE_STATE);
    this.setTooltip('Defines a hardware setpoint value');
    this.setColour(180);
  },
};

export const hardware_input = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput('hardware_input_holder')
      .appendField('Hardware Input:')
      .appendField(
        new Blockly.FieldDropdown([
          ['CLAW', 'Claw'],
          ['ARM', 'Arm'],
          ['DRIVE_BASE', 'DriveBase'],
        ]),
        'hardware_input'
      );
    this.setOutput(true, TYPE_HARDWARE_INPUT);
    this.setTooltip('Selects a target subsystem');
    this.setColour(100);
  },
};

// Negated WME Condition (Tests for absence of a condition)
export const soar_wme_negated_condition = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('WorkingMemoryElement')
      .setCheck(TYPE_HARDWARE_INPUT)
      .appendField('If Not');
    this.appendDummyInput('Operator')
      .appendField(
        new Blockly.FieldDropdown([
          ['Equals', '=='],
          ['Not Equal', '!='],
          ['Greater Than', '>'],
          ['Less Than', '<'],
        ]),
        'Operator'
      );
    this.appendValueInput('Value')
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck(TYPE_HARDWARE_STATE);
    this.setPreviousStatement(true, TYPE_CONDITION);
    this.setNextStatement(true, TYPE_CONDITION);
    this.setTooltip('Matches when a Working Memory Element condition is ABSENT');
    this.setColour(90);
  },
};

// Operator Preference (For Soar Decision Cycle ranking)
export const soar_preference = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Set Preference:')
      .appendField(
        new Blockly.FieldDropdown([
          ['Acceptable (+)', 'ACCEPTABLE'],
          ['Reject (-)', 'REJECT'],
          ['Require (!)', 'REQUIRE'],
          ['Better (>)', 'BETTER'],
          ['Worse (<)', 'WORSE'],
        ]),
        'PREFERENCE_TYPE'
      );
    this.appendDummyInput()
      .appendField('Target Operator:')
      .appendField(new Blockly.FieldTextInput('OperatorName'), 'OPERATOR_NAME');
    this.setPreviousStatement(true, TYPE_PREFERENCE);
    this.setNextStatement(true, TYPE_PREFERENCE);
    this.setTooltip('Assigns a preference weighting to an operator');
    this.setColour(140);
  },
};

// Elaboration Rule (Infers WMEs dynamically without state side-effects)
export const soar_elaboration_rule = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Elaboration:')
      .appendField(new Blockly.FieldTextInput('RuleName'), 'ELAB_NAME');
    this.appendStatementInput('LHS')
      .setCheck(TYPE_CONDITION)
      .appendField('If:');
    this.appendStatementInput('RHS')
      .setCheck(TYPE_ACTION)
      .appendField('Add Derived WME:');
    this.setTooltip('Infers new internal state attributes directly during elaboration phase');
    this.setColour(45);
  },
};

// Internal Working Memory (WME) Modification
export const soar_wme_modify = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('WME Action:')
      .appendField(
        new Blockly.FieldDropdown([
          ['Add (+)', 'ADD'],
          ['Remove (-)', 'REMOVE'],
        ]),
        'ACTION_TYPE'
      );
    this.appendValueInput('ATTRIBUTE')
      .setCheck(TYPE_HARDWARE_INPUT)
      .appendField('Attribute:');
    this.appendValueInput('VALUE')
      .setCheck(TYPE_HARDWARE_STATE)
      .appendField('Value:');
    this.setPreviousStatement(true, TYPE_ACTION);
    this.setNextStatement(true, TYPE_ACTION);
    this.setTooltip('Adds or removes an internal attribute-value pair from Working Memory');
    this.setColour(270);
  },
};

Blockly.common.defineBlocks({
  soar_state_check,
  soar_wme_condition,
  soar_propose_operator,
  soar_apply_rule,
  soar_set_output,
  hardware_state,
  hardware_input,
  soar_wme_modify,
  soar_elaboration_rule,
  soar_preference,
  soar_wme_negated_condition
});