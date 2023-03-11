import { post, get } from './axios'

export const publishContract = (data = {}) => post('/v1/publish_contract', data)
export const updateContract = (data = {}) => post('/v1/update_contract', data)
export const getContract = (data = {}) => get('/v1/get_contract', data)
export const checkContractInfo = (data = {}) => get('/v1/check_contract_info', data)
export const checkUserRegist = (data = {}) => get('/v1/check_user_regist', data)
export const getUserInfo = (data = {}) => get('/v1/get_user_info', data)
export const getTeamFriendList = (data = {}) => get('/v1/get_team_friend_list', data)
export const login = (data = {}) => post('/v1/login', data)
export const regist = (data = {}) => post('/v1/regist', data)
export const updateUserInfo = (data = {}) => post('/v1/update_user_info', data)
export const updateTeamInfo = (data = {}) => post('/v1/update_team_info', data)
export const getNftList = (data = {}) => get('/get_nft_list', data, 'https://worker.dappreader.com')
