export const MIC_ENUM = {
    0: 'DataType',
    1: 'DataCount',
    2: 'SampleRate',
    3: 'InputRange',
    4: 'Sensitivity',
    5: 'FT',
    6: 'npt',
    7: 'nBlocks',
    8: 'Offset',
    9: 'Fmax',
    10: 'dF',
    11: 'Win_dF',
    12: 'Step_Garm',
    13: 'Аg(100)',
    14: 'Agm(155-185)',
    15: 'Fgm(155-185)',
    16: 'Аg(1450)',
    17: 'Аg(2900)',
    18: 'Аg(4350)',
    19: 'Аg(5800)',
    20: 'Аg(7250)',
    21: 'Agm(1-Fm)',
    22: 'Fgm(1-Fm)',
    23: 'M(155-185)',
    24: 'M1(2-10)',
    25: 'M2(10-20)',
    26: 'M3(20-30)',
    27: 'M4(30-40)',
    28: 'M5(40-50)',
    29: 'M6(50-60)',
    30: 'M7(60-70)',
    31: 'M8(70-80)',
    32: 'M1g(2-10)',
    33: 'M1g(10-20)',
    34: 'M1g(20-30)',
    35: 'M1g(30-40)',
    36: 'M1g(40-50)',
    37: 'M1g(50-60)',
    38: 'M1g(60-70)',
    39: 'M1g(70-80)',
    40: 'M(1-5000)',
    41: 'Castom_Kod'


}

export const SCADA_ENUM = {
    0: 'DataType',
    1: 'DataCount',
    2: 'SampleRate',
    3: 'InputRange',
    4: 'Sensitivity',
    5: 'Pogr_MX',
    6: 'Pogr_Disp',
    7: 'Pogr_CKO',
    8: 'Pogr_CKZ',
    9: 'Pogr_Ax',
    10: 'Pogr_Ax',
    11: 'Sing_nmax',
    12: 'Sing_nmin',
    13: 'FT',
    14: 'npt',
    15: 'nBlocks',
    16: 'Offset',
    17: 'Fmax',
    18: 'dF',
    19: 'Win_dF',
    20: 'Step_Garm',
    21: 'Mx',
    22: 'СКО',
    23: 'СКZ',
    24: 'Ax',
    25: 'Ex',
    26: 'Ampl',
    27: 'Amax',
    28: 'Mx-',
    29: 'СКО-',
    30: 'CKZ-',
    31: 'Ax-',
    32: 'Ex-',
    33: 'Ampl-',
    34: 'Amax-',
    35: 'Аg(100)',
    36: 'Agm(155-185)',
    37: 'Fgm(155-185)',
    38: 'Аg(1450)',
    39: 'Аg(2900)',
    40: 'Аg(4350)',
    41: 'Аg(5800)',
    42: 'Аg(7250)',
    43: 'Agm(1-Fm)',
    44: 'Fgm(1-Fm)',
    45: 'А(155-185)',
    46: 'A1(2-10)',
    47: 'A2(10-20)',
    48: 'A3(20-30)',
    49: 'A4(30-40)',
    50: 'A5(40-50)',
    51: 'A6(50-60)',
    52: 'A7(60-70)',
    53: 'A8(70-80)',
    54: 'A9(80-90)',
    55: 'A10(90-100)',
    56: 'A11(100-110)',
    57: 'A12(110-120)',
    58: 'A13(120-130)',
    59: 'A14(130-140)',
    60: 'A15(140-150)',
    61: 'A16(150-160)',
    62: 'A1g(2-10)',
    63: 'A2g(10-20)',
    64: 'A3g(20-30)',
    65: 'A3g(30-40)',
    66: 'A4g(40-50)',
    67: 'A5g(50-60)',
    68: 'A6g(60-70)',
    69: 'A7g(70-80)',
    70: 'A8g(80-90)',
    71: 'A9g(90-100)',
    72: 'A10g(100-110)',
    73: 'A11g(110-120)',
    74: 'A12g(120-130)',
    75: 'A13g(130-140)',
    76: 'A14g(140-150)',
    77: 'A15g(150-160)',
    78: 'A(0-5000)',
    79: 'Castom_Kod',
}

export const ALGORITHMS_ENUM = {
    '1': 'Stаt',
    '2': 'Sing',
    '3': 'Trend',
    '4': 'FFT',
    '4.1': 'DFT',
    '5': 'TrendFFT',
    '5.1': 'TrendDFT',
    '6': 'SCADA_FFT1',
    '6.1': 'SCADA_DFT',
    '7': 'SCADA_FFT2',
    '7.1': 'SCADA_DFT',
    '8': 'MIC_FFT',
    '8.1': 'MIC_DFT'
}

export const MODE = {
    MONITORING: 'monitoring', //for contsant monitoring and inserting new data into db
    TEST_MONITORING: 'test-monitoring', //for test monitoring (watching charts and metrics in webapp)
    TESTING: 'testing', //mode for conducting experiments (tests)
    CALIBRATION: 'calibration' //mode for calibration
}

export const SOCKET_EVENTS = {
    FILE_CHANGE: 'file-change',
    MISSION_START: 'mission-start',
    MISSION_COMPLETE: 'mission-complete',
    CALIBRATION_START: 'calibration-start',
    CALIBRATION_COMPLETE: 'calibration-complete',
    METRICS_UPDATE: 'metrics-update'
}