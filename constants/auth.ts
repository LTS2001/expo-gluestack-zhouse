/**
 * login status token
 */
export const TOKEN = 'jwt_token';

/**
 * identity key
 */
export const IDENTITY_KEY = 'identity_key';

/**
 * user identity classify
 */
export enum EUserIdentityEnum {
  Landlord = 'landlord',
  Tenant = 'tenant',
}

/**
 * user status(tenant or landlord)
 */
export enum EUserStatusEnum {
  StopUsing = -1,
  Delete,
  Normal,
  UnIdentity,
}
