import * as Blockly from 'blockly';
import './blocks'; // Import to guarantee defineBlocks runs!

export const SoarGenerator = new Blockly.Generator('Soar');

const ORDER_ATOMIC = 0;
SoarGenerator.INDENT = '';

// CRITICAL: Chains sequentially connected blocks together
SoarGenerator.scrub_ = function (
  block: Blockly.Block,
  code: string,
  thisOnly?: boolean
) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + SoarGenerator.blockToCode(nextBlock);
  }
  return code;
};

// ---------------------------------------------------------------------------
// Block Generators (Registered on forBlock)
// ---------------------------------------------------------------------------

SoarGenerator.forBlock['hardware_input'] = function (block: Blockly.Block) {
  const input = block.getFieldValue('hardware_input');
  return [input, ORDER_ATOMIC];
};

SoarGenerator.forBlock['hardware_state'] = function (block: Blockly.Block) {
  const state = block.getFieldValue('state');
  return [state, ORDER_ATOMIC];
};

SoarGenerator.forBlock['soar_wme_condition'] = function (block: Blockly.Block) {
  const wme =
    SoarGenerator.valueToCode(block, 'WorkingMemoryElement', ORDER_ATOMIC) ||
    'sensor';
  const operator = block.getFieldValue('Operator');
  const value =
    SoarGenerator.valueToCode(block, 'Value', ORDER_ATOMIC) || 'true';

  let matchExpression = value;
  if (operator === '!=') {
    matchExpression = `<> ${value}`;
  } else if (operator !== '==') {
    matchExpression = `${operator} ${value}`;
  }

  return `   (<s> ^io.sensors.${wme} ${matchExpression})\n`;
};

SoarGenerator.forBlock['soar_state_check'] = function (block: Blockly.Block) {
  const state = block.getFieldValue('agent_state');
  return `   (<s> ^mode ${state})\n`;
};

SoarGenerator.forBlock['soar_set_output'] = function (block: Blockly.Block) {
  const target =
    SoarGenerator.valueToCode(block, 'hardware_input', ORDER_ATOMIC) ||
    'subsystem';
  const value =
    SoarGenerator.valueToCode(block, 'hardware_state', ORDER_ATOMIC) ||
    'DEFAULT';

  return `   (<s> ^io.outputs.${target} ${value})\n`;
};

SoarGenerator.forBlock['soar_apply_rule'] = function (block: Blockly.Block) {
  const applyName = block.getFieldValue('apply_operator_name') || 'default_case';

  let parentOpName = 'UnknownOperator';
  let parent = block.getParent();
  while (parent) {
    if (parent.type === 'soar_propose_operator') {
      parentOpName = parent.getFieldValue('propose_operator_name');
      break;
    }
    parent = parent.getParent();
  }

  const conditions = SoarGenerator.statementToCode(
    block,
    'apply_operator_conditions'
  );
  const actions = SoarGenerator.statementToCode(
    block,
    'apply_operator_actions'
  );

  return (
    `sp {apply*${parentOpName}*${applyName}\n` +
    `   (state <s> ^operator <o>)\n` +
    `   (<o> ^name ${parentOpName})\n` +
    `${conditions}` +
    `-->\n` +
    `${actions}` +
    `}\n\n`
  );
};

SoarGenerator.forBlock['soar_propose_operator'] = function (block: Blockly.Block) {
  const opName = block.getFieldValue('propose_operator_name') || 'DefaultOp';
  const lhs = SoarGenerator.statementToCode(block, 'LHS');
  const rhsApplications = SoarGenerator.statementToCode(block, 'RHS');

  const proposeRule =
    `sp {propose*${opName}\n` +
    `   (state <s> ^type state)\n` +
    `${lhs}` +
    `-->\n` +
    `   (<s> ^operator <o> +)\n` +
    `   (<o> ^name ${opName})\n` +
    `}\n\n`;

  return proposeRule + rhsApplications;
};

// Negated WME Condition
SoarGenerator.forBlock['soar_wme_negated_condition'] = function (block: Blockly.Block) {
  const wme =
    SoarGenerator.valueToCode(block, 'WorkingMemoryElement', ORDER_ATOMIC) ||
    'sensor';
  const operator = block.getFieldValue('Operator');
  const value =
    SoarGenerator.valueToCode(block, 'Value', ORDER_ATOMIC) || 'true';

  let matchExpression = value;
  if (operator === '!=') {
    matchExpression = `<> ${value}`;
  } else if (operator !== '==') {
    matchExpression = `${operator} ${value}`;
  }

  return `   - (<s> ^io.sensors.${wme} ${matchExpression})\n`;
};

// Operator Preference Generator
SoarGenerator.forBlock['soar_preference'] = function (block: Blockly.Block) {
  const prefType = block.getFieldValue('PREFERENCE_TYPE');
  const targetOp = block.getFieldValue('OPERATOR_NAME') || 'TargetOp';

  const prefSymbolMap: Record<string, string> = {
    ACCEPTABLE: '+',
    REJECT: '-',
    REQUIRE: '!',
    BETTER: '>',
    WORSE: '<',
  };

  const symbol = prefSymbolMap[prefType] || '+';

  return `   (<s> ^operator <o> ${symbol})\n   (<o> ^name ${targetOp})\n`;
};

// Elaboration Rule Generator
SoarGenerator.forBlock['soar_elaboration_rule'] = function (block: Blockly.Block) {
  const elabName = block.getFieldValue('ELAB_NAME') || 'default_elaboration';
  const conditions = SoarGenerator.statementToCode(block, 'LHS');
  const actions = SoarGenerator.statementToCode(block, 'RHS');

  return (
    `sp {elaborate*${elabName}\n` +
    `   (state <s> ^type state)\n` +
    `${conditions}` +
    `-->\n` +
    `${actions}` +
    `}\n\n`
  );
};

// Internal Working Memory (WME) Modification
SoarGenerator.forBlock['soar_wme_modify'] = function (block: Blockly.Block) {
  const actionType = block.getFieldValue('ACTION_TYPE');
  const attribute =
    SoarGenerator.valueToCode(block, 'ATTRIBUTE', ORDER_ATOMIC) || 'attribute';
  const value =
    SoarGenerator.valueToCode(block, 'VALUE', ORDER_ATOMIC) || 'value';

  const symbol = actionType === 'ADD' ? '+' : '-';

  return `   (<s> ^${attribute} ${value} ${symbol})\n`;
};