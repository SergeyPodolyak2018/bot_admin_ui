export enum FilterRule {
  Equals = '$eq',
  NotEquals = '$not_eq',
  GreaterThan = '$gt',
  GreaterThanOrEquals = '$gte',
  LessThan = '$lt',
  LessThanOrEquals = '$lte',
  Like = '$like',
  NotLike = '$not_like',
  In = '$in',
  NotIn = '$not_in',
  IsNull = '$is_null',
  IsNotNull = '$is_not_null',
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export enum InteractionStatus {
  FINISHED = 'FINISHED',
  STARTED = 'STARTED',
}
