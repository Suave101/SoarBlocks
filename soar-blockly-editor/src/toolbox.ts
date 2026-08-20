export const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    {
      kind: 'block',
      type: 'controls_repeat_ext',
      inputs: {
        TIMES: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 3,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'text',
    },
  ]
};