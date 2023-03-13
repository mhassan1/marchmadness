import { Rows } from 'marchmadness-types'
import { MADNESS_BRACKET_MAPPINGS } from '../constants'

import { dynamoDBClient } from '../dynamodb'
import { teamsLookup } from './team'

const ROUND1DATE = 'March 16 - 17'
const ROUND2DATE = 'March 18 - 19'
const SWEET16DATE = 'March 23 - 24'
const ELITE8DATE = 'March 25 - 26'
const FINAL4DATE = 'April 1'
const FINALSDATE = 'April 3'
const TOPLEFT = 'SOUTH'
const TOPRIGHT = 'MIDWEST'
const BOTTOMLEFT = 'EAST'
const BOTTOMRIGHT = 'WEST'

export const bracketMappings = [
  [233, 5, 59, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [232, 5, 58, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [231, 5, 57, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [230, 5, 56, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [229, 5, 55, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [228, 5, 54, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [227, 5, 53, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [226, 5, 52, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [225, 5, 50, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [224, 5, 49, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [223, 5, 48, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [222, 5, 47, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [221, 5, 46, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [220, 5, 45, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [219, 5, 44, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [218, 5, 27, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [217, 5, 26, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [216, 5, 25, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [215, 5, 24, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [214, 5, 23, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [213, 5, 22, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [212, 5, 21, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [211, 5, 20, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [210, 5, 18, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [209, 5, 17, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [208, 5, 16, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [207, 5, 15, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [206, 5, 14, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [205, 5, 13, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [204, 5, 12, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [203, 4, 63, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [202, 4, 62, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [201, 4, 61, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [200, 4, 60, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [199, 4, 58, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [198, 4, 57, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [197, 4, 56, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [196, 4, 47, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [195, 4, 46, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [194, 4, 45, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [193, 4, 44, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [192, 4, 42, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [191, 4, 41, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [190, 4, 40, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [189, 4, 31, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [188, 4, 30, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [187, 4, 29, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [186, 4, 28, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [185, 4, 26, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [184, 4, 25, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [183, 4, 24, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [182, 4, 15, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [181, 4, 14, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [180, 4, 13, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [179, 4, 12, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [178, 4, 10, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [177, 4, 9, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [176, 4, 8, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [175, 3, 65, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [174, 3, 64, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [173, 3, 62, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [172, 3, 57, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [171, 3, 56, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [170, 3, 54, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [169, 3, 49, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [168, 3, 48, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [167, 3, 46, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [166, 3, 41, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [165, 3, 40, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [164, 3, 38, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [163, 3, 33, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [162, 3, 32, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [161, 3, 30, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [160, 3, 25, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [159, 3, 24, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [158, 3, 22, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [157, 3, 17, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [156, 3, 16, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [155, 3, 14, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [154, 3, 9, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [153, 3, 8, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [152, 3, 6, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [151, 2, 66, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [150, 2, 62, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [149, 2, 58, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [148, 2, 54, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [147, 2, 50, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [146, 2, 46, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [145, 2, 42, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [144, 2, 38, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [143, 2, 34, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [142, 2, 30, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [141, 2, 26, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [140, 2, 22, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [139, 2, 18, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [138, 2, 14, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [137, 2, 10, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [136, 2, 6, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
  [135, 7, 66, '{"visibility":"hidden"}', '', 0, 1, '', null], // round 0 games
  [134, 7, 65, '{"visibility":"hidden"}', '', 0, 1, '', null],
  [133, 8, 66, '{"visibility":"hidden"}', '', 0, 1, '', null],
  [132, 8, 65, '{"visibility":"hidden"}', '', 0, 1, '', null],
  [131, 5, 66, '{"visibility":"hidden"}', '', 0, 1, '', null],
  [130, 5, 65, '{"visibility":"hidden"}', '', 0, 1, '', null],
  [129, 4, 66, '{"visibility":"hidden"}', '', 0, 1, '', null],
  [128, 4, 65, '{"visibility":"hidden"}', '', 0, 1, '', null],
  [127, 6, 35, '{"border":"1px solid orange"}', '1', 7, 0, '', null],
  [126, 7, 35, '', '1.2', 6, 0, '', null],
  [125, 5, 35, '', '1.1', 6, 0, '', null],
  [124, 7, 51, '{"borderRight":"1px solid black"}', '1.2.2', 5, 0, '', null],
  [123, 8, 59, '{"borderRight":"1px solid black"}', '1.2.2.2', 4, 0, '', null],
  [122, 8, 43, '{"borderRight":"1px solid black"}', '1.2.2.1', 4, 0, '', null],
  [
    121,
    9,
    63,
    '{"borderRight":"1px solid black"}',
    '1.2.2.2.2',
    3,
    0,
    '',
    null,
  ],
  [
    120,
    9,
    55,
    '{"borderRight":"1px solid black"}',
    '1.2.2.2.1',
    3,
    0,
    '',
    null,
  ],
  [
    119,
    9,
    47,
    '{"borderRight":"1px solid black"}',
    '1.2.2.1.2',
    3,
    0,
    '',
    null,
  ],
  [
    118,
    9,
    39,
    '{"borderRight":"1px solid black"}',
    '1.2.2.1.1',
    3,
    0,
    '',
    null,
  ],
  [
    117,
    10,
    65,
    '{"borderRight":"1px solid black"}',
    '1.2.2.2.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    116,
    10,
    61,
    '{"borderRight":"1px solid black"}',
    '1.2.2.2.2.1',
    2,
    0,
    '',
    null,
  ],
  [
    115,
    10,
    57,
    '{"borderRight":"1px solid black"}',
    '1.2.2.2.1.2',
    2,
    0,
    '',
    null,
  ],
  [
    114,
    10,
    53,
    '{"borderRight":"1px solid black"}',
    '1.2.2.2.1.1',
    2,
    0,
    '',
    null,
  ],
  [
    113,
    10,
    49,
    '{"borderRight":"1px solid black"}',
    '1.2.2.1.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    112,
    10,
    45,
    '{"borderRight":"1px solid black"}',
    '1.2.2.1.2.1',
    2,
    0,
    '',
    null,
  ],
  [
    111,
    10,
    41,
    '{"borderRight":"1px solid black"}',
    '1.2.2.1.1.2',
    2,
    0,
    '',
    null,
  ],
  [
    110,
    10,
    37,
    '{"borderRight":"1px solid black"}',
    '1.2.2.1.1.1',
    2,
    0,
    '',
    null,
  ],
  [109, 11, 66, '', '1.2.2.2.2.2.2', 1, 1, '', 15],
  [108, 11, 64, '', '1.2.2.2.2.2.1', 1, 1, '', 2],
  [107, 11, 62, '', '1.2.2.2.2.1.2', 1, 1, '', 10],
  [106, 11, 60, '', '1.2.2.2.2.1.1', 1, 1, '', 7],
  [105, 11, 58, '', '1.2.2.2.1.2.2', 1, 1, '', 14],
  [104, 11, 56, '', '1.2.2.2.1.2.1', 1, 1, '', 3],
  [103, 11, 54, '', '1.2.2.2.1.1.2', 1, 1, '', 11],
  [102, 11, 52, '', '1.2.2.2.1.1.1', 1, 1, '', 6],
  [101, 11, 50, '', '1.2.2.1.2.2.2', 1, 1, '', 13],
  [100, 11, 48, '', '1.2.2.1.2.2.1', 1, 1, '', 4],
  [99, 11, 46, '', '1.2.2.1.2.1.2', 1, 1, '', 12],
  [98, 11, 44, '', '1.2.2.1.2.1.1', 1, 1, '', 5],
  [97, 11, 42, '', '1.2.2.1.1.2.2', 1, 1, '', 9],
  [96, 11, 40, '', '1.2.2.1.1.2.1', 1, 1, '', 8],
  [95, 11, 38, '', '1.2.2.1.1.1.2', 1, 1, '', 16],
  [94, 11, 36, '', '1.2.2.1.1.1.1', 1, 1, '', 1],
  [93, 7, 19, '{"borderRight":"1px solid black"}', '1.2.1', 5, 0, '', null],
  [92, 8, 27, '{"borderRight":"1px solid black"}', '1.2.1.2', 4, 0, '', null],
  [91, 8, 11, '{"borderRight":"1px solid black"}', '1.2.1.1', 4, 0, '', null],
  [90, 9, 31, '{"borderRight":"1px solid black"}', '1.2.1.2.2', 3, 0, '', null],
  [89, 9, 23, '{"borderRight":"1px solid black"}', '1.2.1.2.1', 3, 0, '', null],
  [88, 9, 15, '{"borderRight":"1px solid black"}', '1.2.1.1.2', 3, 0, '', null],
  [87, 9, 7, '{"borderRight":"1px solid black"}', '1.2.1.1.1', 3, 0, '', null],
  [
    86,
    10,
    33,
    '{"borderRight":"1px solid black"}',
    '1.2.1.2.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    85,
    10,
    29,
    '{"borderRight":"1px solid black"}',
    '1.2.1.2.2.1',
    2,
    0,
    '',
    null,
  ],
  [
    84,
    10,
    25,
    '{"borderRight":"1px solid black"}',
    '1.2.1.2.1.2',
    2,
    0,
    '',
    null,
  ],
  [
    83,
    10,
    21,
    '{"borderRight":"1px solid black"}',
    '1.2.1.2.1.1',
    2,
    0,
    '',
    null,
  ],
  [
    82,
    10,
    17,
    '{"borderRight":"1px solid black"}',
    '1.2.1.1.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    81,
    10,
    13,
    '{"borderRight":"1px solid black"}',
    '1.2.1.1.2.1',
    2,
    0,
    '',
    null,
  ],
  [
    80,
    10,
    9,
    '{"borderRight":"1px solid black"}',
    '1.2.1.1.1.2',
    2,
    0,
    '',
    null,
  ],
  [
    79,
    10,
    5,
    '{"borderRight":"1px solid black"}',
    '1.2.1.1.1.1',
    2,
    0,
    '',
    null,
  ],
  [78, 11, 34, '', '1.2.1.2.2.2.2', 1, 1, '', 15],
  [77, 11, 32, '', '1.2.1.2.2.2.1', 1, 1, '', 2],
  [76, 11, 30, '', '1.2.1.2.2.1.2', 1, 1, '', 10],
  [75, 11, 28, '', '1.2.1.2.2.1.1', 1, 1, '', 7],
  [74, 11, 26, '', '1.2.1.2.1.2.2', 1, 1, '', 14],
  [73, 11, 24, '', '1.2.1.2.1.2.1', 1, 1, '', 3],
  [72, 11, 22, '', '1.2.1.2.1.1.2', 1, 1, '', 11],
  [71, 11, 20, '', '1.2.1.2.1.1.1', 1, 1, '', 6],
  [70, 11, 18, '', '1.2.1.1.2.2.2', 1, 1, '', 13],
  [69, 11, 16, '', '1.2.1.1.2.2.1', 1, 1, '', 4],
  [68, 11, 14, '', '1.2.1.1.2.1.2', 1, 1, '', 12],
  [67, 11, 12, '', '1.2.1.1.2.1.1', 1, 1, '', 5],
  [66, 11, 10, '', '1.2.1.1.1.2.2', 1, 1, '', 9],
  [65, 11, 8, '', '1.2.1.1.1.2.1', 1, 1, '', 8],
  [64, 11, 6, '', '1.2.1.1.1.1.2', 1, 1, '', 16],
  [63, 11, 4, '', '1.2.1.1.1.1.1', 1, 1, '', 1],
  [62, 5, 51, '{"borderLeft":"1px solid black"}', '1.1.2', 5, 0, '', null],
  [61, 4, 59, '{"borderLeft":"1px solid black"}', '1.1.2.2', 4, 0, '', null],
  [60, 4, 43, '{"borderLeft":"1px solid black"}', '1.1.2.1', 4, 0, '', null],
  [59, 3, 63, '{"borderLeft":"1px solid black"}', '1.1.2.2.2', 3, 0, '', null],
  [58, 3, 55, '{"borderLeft":"1px solid black"}', '1.1.2.2.1', 3, 0, '', null],
  [57, 3, 47, '{"borderLeft":"1px solid black"}', '1.1.2.1.2', 3, 0, '', null],
  [56, 3, 39, '{"borderLeft":"1px solid black"}', '1.1.2.1.1', 3, 0, '', null],
  [
    55,
    2,
    65,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.2.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    54,
    2,
    61,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.2.2.1',
    2,
    0,
    '',
    null,
  ],
  [
    53,
    2,
    57,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.2.1.2',
    2,
    0,
    '',
    null,
  ],
  [
    52,
    2,
    53,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.2.1.1',
    2,
    0,
    '',
    null,
  ],
  [
    51,
    2,
    49,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.1.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    50,
    2,
    45,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.1.2.1',
    2,
    0,
    '',
    null,
  ],
  [
    49,
    2,
    41,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.1.1.2',
    2,
    0,
    '',
    null,
  ],
  [
    48,
    2,
    37,
    '{"borderLeft":"1px solid black"}',
    '1.1.2.1.1.1',
    2,
    0,
    '',
    null,
  ],
  [47, 1, 66, '', '1.1.2.2.2.2.2', 1, 1, '', 15],
  [46, 1, 64, '', '1.1.2.2.2.2.1', 1, 1, '', 2],
  [45, 1, 62, '', '1.1.2.2.2.1.2', 1, 1, '', 10],
  [44, 1, 60, '', '1.1.2.2.2.1.1', 1, 1, '', 7],
  [43, 1, 58, '', '1.1.2.2.1.2.2', 1, 1, '', 14],
  [42, 1, 56, '', '1.1.2.2.1.2.1', 1, 1, '', 3],
  [41, 1, 54, '', '1.1.2.2.1.1.2', 1, 1, '', 11],
  [40, 1, 52, '', '1.1.2.2.1.1.1', 1, 1, '', 6],
  [39, 1, 50, '', '1.1.2.1.2.2.2', 1, 1, '', 13],
  [38, 1, 48, '', '1.1.2.1.2.2.1', 1, 1, '', 4],
  [37, 1, 46, '', '1.1.2.1.2.1.2', 1, 1, '', 12],
  [36, 1, 44, '', '1.1.2.1.2.1.1', 1, 1, '', 5],
  [35, 1, 42, '', '1.1.2.1.1.2.2', 1, 1, '', 9],
  [34, 1, 40, '', '1.1.2.1.1.2.1', 1, 1, '', 8],
  [33, 1, 38, '', '1.1.2.1.1.1.2', 1, 1, '', 16],
  [32, 1, 36, '', '1.1.2.1.1.1.1', 1, 1, '', 1],
  [31, 5, 19, '{"borderLeft":"1px solid black"}', '1.1.1', 5, 0, '', null],
  [30, 4, 27, '{"borderLeft":"1px solid black"}', '1.1.1.2', 4, 0, '', null],
  [29, 4, 11, '{"borderLeft":"1px solid black"}', '1.1.1.1', 4, 0, '', null],
  [28, 3, 31, '{"borderLeft":"1px solid black"}', '1.1.1.2.2', 3, 0, '', null],
  [27, 3, 23, '{"borderLeft":"1px solid black"}', '1.1.1.2.1', 3, 0, '', null],
  [26, 3, 15, '{"borderLeft":"1px solid black"}', '1.1.1.1.2', 3, 0, '', null],
  [25, 3, 7, '{"borderLeft":"1px solid black"}', '1.1.1.1.1', 3, 0, '', null],
  [
    24,
    2,
    33,
    '{"borderLeft":"1px solid black"}',
    '1.1.1.2.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    23,
    2,
    29,
    '{"borderLeft":"1px solid black"}',
    '1.1.1.2.2.1',
    2,
    0,
    '',
    null,
  ],
  [
    22,
    2,
    25,
    '{"borderLeft":"1px solid black"}',
    '1.1.1.2.1.2',
    2,
    0,
    '',
    null,
  ],
  [
    21,
    2,
    21,
    '{"borderLeft":"1px solid black"}',
    '1.1.1.2.1.1',
    2,
    0,
    '',
    null,
  ],
  [
    20,
    2,
    17,
    '{"borderLeft":"1px solid black"}',
    '1.1.1.1.2.2',
    2,
    0,
    '',
    null,
  ],
  [
    19,
    2,
    13,
    '{"borderLeft":"1px solid black"}',
    '1.1.1.1.2.1',
    2,
    0,
    '',
    null,
  ],
  [18, 2, 9, '{"borderLeft":"1px solid black"}', '1.1.1.1.1.2', 2, 0, '', null],
  [17, 2, 5, '{"borderLeft":"1px solid black"}', '1.1.1.1.1.1', 2, 0, '', null],
  [16, 1, 34, '', '1.1.1.2.2.2.2', 1, 1, '', 15],
  [15, 1, 32, '', '1.1.1.2.2.2.1', 1, 1, '', 2],
  [14, 1, 30, '', '1.1.1.2.2.1.2', 1, 1, '', 10],
  [13, 1, 28, '', '1.1.1.2.2.1.1', 1, 1, '', 7],
  [12, 1, 26, '', '1.1.1.2.1.2.2', 1, 1, '', 14],
  [11, 1, 24, '', '1.1.1.2.1.2.1', 1, 1, '', 3],
  [10, 1, 22, '', '1.1.1.2.1.1.2', 1, 1, '', 11],
  [9, 1, 20, '', '1.1.1.2.1.1.1', 1, 1, '', 6],
  [8, 1, 18, '', '1.1.1.1.2.2.2', 1, 1, '', 13],
  [7, 1, 16, '', '1.1.1.1.2.2.1', 1, 1, '', 4],
  [6, 1, 14, '', '1.1.1.1.2.1.2', 1, 1, '', 12],
  [5, 1, 12, '', '1.1.1.1.2.1.1', 1, 1, '', 5],
  [4, 1, 10, '', '1.1.1.1.1.2.2', 1, 1, '', 9],
  [3, 1, 8, '', '1.1.1.1.1.2.1', 1, 1, '', 8],
  [2, 1, 6, '', '1.1.1.1.1.1.2', 1, 1, '', 16],
  [1, 1, 4, '', '1.1.1.1.1.1.1', 1, 1, '', 1],
  [331, 7, 59, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [330, 7, 58, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [329, 7, 57, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [328, 7, 56, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [327, 7, 55, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [326, 7, 54, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [325, 7, 53, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [324, 7, 52, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [323, 7, 50, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [322, 7, 49, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [321, 7, 48, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [320, 7, 47, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [319, 7, 46, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [318, 7, 45, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [317, 7, 44, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [316, 7, 27, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [315, 7, 26, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [314, 7, 25, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [313, 7, 24, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [312, 7, 23, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [311, 7, 22, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [310, 7, 21, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [309, 7, 20, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [308, 7, 18, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [307, 7, 17, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [306, 7, 16, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [305, 7, 15, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [304, 7, 14, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [303, 7, 13, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [302, 7, 12, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [301, 8, 63, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [300, 8, 62, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [299, 8, 61, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [298, 8, 60, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [297, 8, 58, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [296, 8, 57, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [295, 8, 56, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [294, 8, 47, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [293, 8, 46, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [292, 8, 45, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [291, 8, 44, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [290, 8, 42, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [289, 8, 41, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [288, 8, 40, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [287, 8, 31, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [286, 8, 30, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [285, 8, 29, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [284, 8, 28, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [283, 8, 26, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [282, 8, 25, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [281, 8, 24, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [280, 8, 15, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [279, 8, 14, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [278, 8, 13, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [277, 8, 12, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [276, 8, 10, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [275, 8, 9, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [274, 8, 8, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [273, 9, 65, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [272, 9, 64, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [271, 9, 62, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [270, 9, 57, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [269, 9, 56, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [268, 9, 54, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [267, 9, 49, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [266, 9, 48, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [265, 9, 46, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [264, 9, 41, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [263, 9, 40, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [262, 9, 38, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [261, 9, 33, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [260, 9, 32, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [259, 9, 30, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [258, 9, 25, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [257, 9, 24, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [256, 9, 22, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [255, 9, 17, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [254, 9, 16, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [253, 9, 14, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [252, 9, 9, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [251, 9, 8, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [250, 9, 6, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [249, 10, 66, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [248, 10, 62, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [247, 10, 58, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [246, 10, 54, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [245, 10, 50, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [244, 10, 46, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [243, 10, 42, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [242, 10, 38, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [241, 10, 34, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [240, 10, 30, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [239, 10, 26, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [238, 10, 22, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [237, 10, 18, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [236, 10, 14, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [235, 10, 10, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [234, 10, 6, '{"borderRight":"1px solid black"}', '', null, null, '', null],
  [
    334,
    2,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Round 2',
    null,
  ],
  [333, 1, 2, '{"textAlign":"center"}', '', null, null, ROUND1DATE, null],
  [
    332,
    1,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Round 1',
    null,
  ],
  [
    342,
    11,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Round 1',
    null,
  ],
  [341, 5, 2, '{"textAlign":"center"}', '', null, null, FINAL4DATE, null],
  [
    340,
    5,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Final 4',
    null,
  ],
  [339, 4, 2, '{"textAlign":"center"}', '', null, null, ELITE8DATE, null],
  [
    338,
    4,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Elite 8',
    null,
  ],
  [337, 3, 2, '{"textAlign":"center"}', '', null, null, SWEET16DATE, null],
  [
    336,
    3,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Sweet 16',
    null,
  ],
  [335, 2, 2, '{"textAlign":"center"}', '', null, null, ROUND2DATE, null],
  [
    352,
    6,
    30,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Finals',
    null,
  ],
  [351, 7, 2, '{"textAlign":"center"}', '', null, null, FINAL4DATE, null],
  [
    350,
    7,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Final 4',
    null,
  ],
  [349, 8, 2, '{"textAlign":"center"}', '', null, null, ELITE8DATE, null],
  [
    348,
    8,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Elite 8',
    null,
  ],
  [347, 9, 2, '{"textAlign":"center"}', '', null, null, SWEET16DATE, null],
  [
    346,
    9,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Sweet 16',
    null,
  ],
  [345, 10, 2, '{"textAlign":"center"}', '', null, null, ROUND2DATE, null],
  [
    344,
    10,
    1,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    'Round 2',
    null,
  ],
  [343, 11, 2, '{"textAlign":"center"}', '', null, null, ROUND1DATE, null],
  [353, 6, 31, '{"textAlign":"center"}', '', null, null, FINALSDATE, null],
  [
    357,
    9,
    51,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    BOTTOMRIGHT,
    null,
  ],
  [
    356,
    9,
    19,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    TOPRIGHT,
    null,
  ],
  [
    355,
    3,
    51,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    BOTTOMLEFT,
    null,
  ],
  [
    354,
    3,
    19,
    '{"textAlign":"center","fontWeight":"bold"}',
    '',
    null,
    null,
    TOPLEFT,
    null,
  ],
  [0, 2, 6, '{"borderLeft":"1px solid black"}', '', null, null, '', null],
].map(([bracket_id, c, r, style, hier, round, fixed, label, seed]) => ({
  bracket_id,
  c,
  r,
  style,
  hier,
  round,
  fixed,
  label,
  seed,
})) as Rows

export const getBracketMappingsWithTeams = async (): Promise<Rows> => {
  const { Items } = (await dynamoDBClient
    .scan({
      TableName: MADNESS_BRACKET_MAPPINGS,
    })
    .promise()) as unknown as { Items: Rows }
  const teamsByBracketId = Object.fromEntries(
    Items.map(({ bracket_id, team_id, fixed, hier, seed }) => [
      bracket_id,
      { team_id, fixed, hier, seed },
    ])
  )
  return bracketMappings.map((mapping) => {
    const team = teamsByBracketId[mapping.bracket_id]
    if (!team)
      return {
        ...mapping,
        team_name: mapping.label,
      }
    const { team_id, fixed, hier, seed } = team
    const team_name = teamsLookup[Number(team_id)]
    return {
      ...mapping,
      team_id,
      team_name: team_name
        ? `${seed || mapping.seed} ${team_name}`
        : mapping.label,
      fixed: fixed ?? mapping.fixed,
      hier: hier || mapping.hier,
      seed: seed || mapping.seed,
    }
  })
}

export const getBracketMappingsWithTeamsLookup = async (): Promise<
  Record<number, Rows[number]>
> => {
  const bracketMappings = await getBracketMappingsWithTeams()
  return Object.fromEntries(
    bracketMappings.map((mapping) => [mapping.bracket_id, mapping])
  )
}
