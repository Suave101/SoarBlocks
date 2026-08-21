import * as Blockly from 'blockly';
import {
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
} from './blocks.ts'

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

export const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'soar_wme_condition' },
    { kind: 'block', type: 'soar_state_check' },
    { kind: 'block', type: 'soar_propose_operator' },
    { kind: 'block', type: 'soar_apply_rule' },
    { kind: 'block', type: 'soar_set_output' },
    { kind: 'block', type: 'hardware_state' },
    { kind: 'block', type: 'hardware_input' },
    { kind: 'block', type: 'soar_wme_modify' },
    { kind: 'block', type: 'soar_elaboration_rule' },
    { kind: 'block', type: 'soar_preference' },
    { kind: 'block', type: 'soar_wme_negated_condition' },
  ],
};