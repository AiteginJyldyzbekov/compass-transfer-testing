export interface GetPotentialDriverDTO {
  id: string;
  fullName: string;
  rank: number;
  allTrue: boolean;
  isOnline: boolean;
  activeCarStatus: boolean;
  activeCarPassengerCapacity: boolean;
  activeCarServiceClass: boolean;
  distancePredicate: boolean;
  driverMinRating: boolean;
  driverHasNoActiveRides: boolean;
  driverHasNotBeenRequested: boolean;
  driverQueuePresent: boolean;
}
