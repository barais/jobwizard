/*
We use constants in Vuex for several reasons:
1. Preventing duplicate names
2. Preventing usage/calling of getter/mutation/action with non-existent name
3. Getting advantage of IDE code-completion and usage of constants (i.e. to spot unused names)
*/

// getters
export const GET_STEP = 'GET_STEP';
export const GET_FORM = 'GET_FORM';
export const GET_SETTINGS = 'GET_SETTINGS';
export const GET_LANG = 'GET_LANG';
export const GET_LOGO = 'GET_LOGO';
export const GET_META = 'GET_META';
export const GET_LOCATION = 'GET_LOCATION';
export const GET_HEADER = 'GET_HEADER';
export const GET_HTML = 'GET_HTML';
export const GET_TOKEN = 'GET_TOKEN';
export const HAS_AUTH = 'HAS_AUTH';

// mutations
export const SET_STEP = 'SET_STEP';
export const CLEAR_FORM = 'CLEAR_FORM';
export const SET_FIELD = 'SET_FIELD';
export const SET_JOB = 'SET_JOB';
export const SET_SETTINGS_FIELD = 'SET_SETTINGS_FIELD';
export const SET_LANG = 'SET_LANG';
export const SET_LOGO = 'SET_LOGO';
export const SET_META = 'SET_META';
export const SET_HEADER = 'SET_HEADER';
export const SET_HTML = 'SET_HTML';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_LOCATION = 'SET_LOCATION';
