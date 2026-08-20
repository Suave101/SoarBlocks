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