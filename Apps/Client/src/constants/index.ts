export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
};

export enum UserType {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Regular = 'Regular',
}

export enum TokenType {
  ConfirmEmail = 'ConfirmEmail',
  ResetPassword = 'ResetPassword',
}

export enum DialogName {
  AddToOrRemoveFromFavoriteUsers = 'AddToOrRemoveFromFavoriteUsers',
  ConfirmOrInfirmEmailAddress = 'ConfirmOrInfirmEmailAddress',
  PromoteOrDemoteUser = 'PromoteOrDemoteUser',
  BanUser = 'BanUser',
  DeleteUser = 'DeleteUser',
}