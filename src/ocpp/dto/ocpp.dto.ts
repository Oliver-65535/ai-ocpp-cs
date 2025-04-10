// Enums
export enum AuthorizationStatus {
  Accepted = 'Accepted',
  Blocked = 'Blocked',
  Expired = 'Expired',
  Invalid = 'Invalid',
  ConcurrentTx = 'ConcurrentTx'
}

export enum BootNotificationStatus {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected'
}

export enum CancelReservationStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export enum CertificateSignedStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export enum ChangeAvailabilityType {
  Inoperative = 'Inoperative',
  Operative = 'Operative'
}

export enum ChangeAvailabilityStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Scheduled = 'Scheduled'
}

export enum ChangeConfigurationStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  RebootRequired = 'RebootRequired',
  NotSupported = 'NotSupported'
}

export enum ClearCacheStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export enum ClearChargingProfileStatus {
  Accepted = 'Accepted',
  Unknown = 'Unknown'
}

export enum DataTransferStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  UnknownMessageId = 'UnknownMessageId',
  UnknownVendorId = 'UnknownVendorId'
}

export enum DeleteCertificateStatus {
  Accepted = 'Accepted',
  Failed = 'Failed',
  NotFound = 'NotFound'
}

export enum DiagnosticsStatus {
  Idle = 'Idle',
  Uploaded = 'Uploaded',
  UploadFailed = 'UploadFailed',
  Uploading = 'Uploading'
}

export enum MessageTrigger {
  BootNotification = 'BootNotification',
  LogStatusNotification = 'LogStatusNotification',
  FirmwareStatusNotification = 'FirmwareStatusNotification',
  Heartbeat = 'Heartbeat',
  MeterValues = 'MeterValues',
  SignChargePointCertificate = 'SignChargePointCertificate',
  StatusNotification = 'StatusNotification'
}

export enum TriggerMessageStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  NotImplemented = 'NotImplemented'
}

export enum FirmwareStatus {
  Downloaded = 'Downloaded',
  DownloadFailed = 'DownloadFailed',
  Downloading = 'Downloading',
  Idle = 'Idle',
  InstallationFailed = 'InstallationFailed',
  Installing = 'Installing',
  Installed = 'Installed'
}

export enum ChargingRateUnit {
  A = 'A',
  W = 'W'
}

export enum RemoteStartTransactionStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export enum RemoteStopTransactionStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export enum ReserveNowStatus {
  Accepted = 'Accepted',
  Faulted = 'Faulted',
  Occupied = 'Occupied',
  Rejected = 'Rejected',
  Unavailable = 'Unavailable'
}

export enum ResetType {
  Hard = 'Hard',
  Soft = 'Soft'
}

export enum ResetStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export enum SendLocalListStatus {
  Accepted = 'Accepted',
  Failed = 'Failed',
  NotSupported = 'NotSupported',
  VersionMismatch = 'VersionMismatch'
}

export enum SetChargingProfileStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  NotSupported = 'NotSupported'
}

export enum ChargingProfilePurpose {
  ChargePointMaxProfile = 'ChargePointMaxProfile',
  TxDefaultProfile = 'TxDefaultProfile',
  TxProfile = 'TxProfile'
}

export enum ChargingProfileKind {
  Absolute = 'Absolute',
  Recurring = 'Recurring',
  Relative = 'Relative'
}

export enum RecurrencyKind {
  Daily = 'Daily',
  Weekly = 'Weekly'
}

export enum StatusNotificationErrorCode {
  ConnectorLockFailure = 'ConnectorLockFailure',
  EVCommunicationError = 'EVCommunicationError',
  GroundFailure = 'GroundFailure',
  HighTemperature = 'HighTemperature',
  InternalError = 'InternalError',
  LocalListConflict = 'LocalListConflict',
  NoError = 'NoError',
  OtherError = 'OtherError',
  OverCurrentFailure = 'OverCurrentFailure',
  PowerMeterFailure = 'PowerMeterFailure',
  PowerSwitchFailure = 'PowerSwitchFailure',
  ReaderFailure = 'ReaderFailure',
  ResetFailure = 'ResetFailure',
  UnderVoltage = 'UnderVoltage',
  OverVoltage = 'OverVoltage',
  WeakSignal = 'WeakSignal'
}

export enum StatusNotificationStatus {
  Available = 'Available',
  Preparing = 'Preparing',
  Charging = 'Charging',
  SuspendedEVSE = 'SuspendedEVSE',
  SuspendedEV = 'SuspendedEV',
  Finishing = 'Finishing',
  Reserved = 'Reserved',
  Unavailable = 'Unavailable',
  Faulted = 'Faulted'
}

export enum StopTransactionReason {
  EmergencyStop = 'EmergencyStop',
  EVDisconnected = 'EVDisconnected',
  HardReset = 'HardReset',
  Local = 'Local',
  Other = 'Other',
  PowerLoss = 'PowerLoss',
  Reboot = 'Reboot',
  Remote = 'Remote',
  SoftReset = 'SoftReset',
  UnlockCommand = 'UnlockCommand',
  DeAuthorized = 'DeAuthorized'
}

export enum UnlockConnectorStatus {
  Unlocked = 'Unlocked',
  UnlockFailed = 'UnlockFailed',
  NotSupported = 'NotSupported'
}

// DTOs
export class IdTagInfo {
  expiryDate?: string;
  parentIdTag?: string;
  status: AuthorizationStatus;
}

export class AuthorizeRequest {
  idTag: string;
}

export class AuthorizeResponse {
  idTagInfo: IdTagInfo;
}

export class BootNotificationRequest {
  chargePointVendor: string;
  chargePointModel: string;
  chargePointSerialNumber?: string;
  chargeBoxSerialNumber?: string;
  firmwareVersion?: string;
  iccid?: string;
  imsi?: string;
  meterType?: string;
  meterSerialNumber?: string;
}

export class BootNotificationResponse {
  status: BootNotificationStatus;
  currentTime: string;
  interval: number;
}

export class CancelReservationRequest {
  reservationId: number;
}

export class CancelReservationResponse {
  status: CancelReservationStatus;
}

export class CertificateSignedRequest {
  certificateChain: string;
}

export class CertificateSignedResponse {
  status: CertificateSignedStatus;
}

export class ChangeAvailabilityRequest {
  connectorId: number;
  type: ChangeAvailabilityType;
}

export class ChangeAvailabilityResponse {
  status: ChangeAvailabilityStatus;
}

export class ChangeConfigurationRequest {
  key: string;
  value: string;
}

export class ChangeConfigurationResponse {
  status: ChangeConfigurationStatus;
}

export class ClearCacheRequest {}

export class ClearCacheResponse {
  status: ClearCacheStatus;
}

export class ClearChargingProfileRequest {
  id?: number;
  connectorId?: number;
  chargingProfilePurpose?: ChargingProfilePurpose;
  stackLevel?: number;
}

export class ClearChargingProfileResponse {
  status: ClearChargingProfileStatus;
}

export class DataTransferRequest {
  vendorId: string;
  messageId?: string;
  data?: string;
}

export class DataTransferResponse {
  status: DataTransferStatus;
  data?: string;
}

export class DeleteCertificateRequest {
  certificateHashData: {
    hashAlgorithm: string;
    issuerNameHash: string;
    issuerKeyHash: string;
    serialNumber: string;
  };
}

export class DeleteCertificateResponse {
  status: DeleteCertificateStatus;
}

export class DiagnosticsStatusNotificationRequest {
  status: DiagnosticsStatus;
}

export class DiagnosticsStatusNotificationResponse {}

export class ExtendedTriggerMessageRequest {
  requestedMessage: MessageTrigger;
  connectorId?: number;
}

export class ExtendedTriggerMessageResponse {
  status: TriggerMessageStatus;
}

export class FirmwareStatusNotificationRequest {
  status: FirmwareStatus;
}

export class FirmwareStatusNotificationResponse {}

export class ChargingSchedulePeriod {
  startPeriod: number;
  limit: number;
  numberPhases?: number;
}

export class ChargingSchedule {
  duration?: number;
  startSchedule?: string;
  chargingRateUnit: ChargingRateUnit;
  chargingSchedulePeriod: ChargingSchedulePeriod[];
  minChargingRate?: number;
}

export class GetCompositeScheduleRequest {
  connectorId: number;
  duration: number;
  chargingRateUnit?: ChargingRateUnit;
}

export class GetCompositeScheduleResponse {
  status: string;
  connectorId?: number;
  scheduleStart?: string;
  chargingSchedule?: ChargingSchedule;
}

export class GetConfigurationRequest {
  key?: string[];
}

export class ConfigurationKey {
  key: string;
  readonly: boolean;
  value?: string;
}

export class GetConfigurationResponse {
  configurationKey?: ConfigurationKey[];
  unknownKey?: string[];
}

export class GetDiagnosticsRequest {
  location: string;
  retries?: number;
  retryInterval?: number;
  startTime?: string;
  stopTime?: string;
}

export class GetDiagnosticsResponse {
  fileName?: string;
}

export class GetInstalledCertificateIdsRequest {
  certificateType: string;
}

export class GetInstalledCertificateIdsResponse {
  certificateHashData?: {
    hashAlgorithm: string;
    issuerNameHash: string;
    issuerKeyHash: string;
    serialNumber: string;
  }[];
  status: string;
}

export class GetLocalListVersionRequest {}

export class GetLocalListVersionResponse {
  listVersion: number;
}

export class LogParameters {
  remoteLocation: string;
  oldestTimestamp?: string;
  latestTimestamp?: string;
}

export class GetLogRequest {
  log: LogParameters;
  logType: string;
  requestId: number;
  retries?: number;
  retryInterval?: number;
}

export class GetLogResponse {
  status: string;
  filename?: string;
}

export class HeartbeatRequest {}

export class HeartbeatResponse {
  currentTime: string;
}

export class InstallCertificateRequest {
  certificateType: string;
  certificate: string;
}

export class InstallCertificateResponse {
  status: string;
}

export class LogStatusNotificationRequest {
  status: string;
  requestId?: number;
}

export class LogStatusNotificationResponse {}

export class SampledValue {
  value: string;
  context?: string;
  format?: string;
  measurand?: string;
  phase?: string;
  location?: string;
  unit?: string;
}

export class MeterValue {
  timestamp: string;
  sampledValue: SampledValue[];
}

export class MeterValuesRequest {
  connectorId: number;
  transactionId?: number;
  meterValue: MeterValue[];
}

export class MeterValuesResponse {}

export class ChargingProfile {
  chargingProfileId: number;
  transactionId?: number;
  stackLevel: number;
  chargingProfilePurpose: ChargingProfilePurpose;
  chargingProfileKind: ChargingProfileKind;
  recurrencyKind?: RecurrencyKind;
  validFrom?: string;
  validTo?: string;
  chargingSchedule: ChargingSchedule;
}

export class RemoteStartTransactionRequest {
  connectorId?: number;
  idTag: string;
  chargingProfile?: ChargingProfile;
}

export class RemoteStartTransactionResponse {
  status: RemoteStartTransactionStatus;
}

export class RemoteStopTransactionRequest {
  transactionId: number;
}

export class RemoteStopTransactionResponse {
  status: RemoteStopTransactionStatus;
}

export class ReserveNowRequest {
  connectorId: number;
  expiryDate: string;
  idTag: string;
  parentIdTag?: string;
  reservationId: number;
}

export class ReserveNowResponse {
  status: ReserveNowStatus;
}

export class ResetRequest {
  type: ResetType;
}

export class ResetResponse {
  status: ResetStatus;
}

export class SecurityEventNotificationRequest {
  type: string;
  timestamp: string;
  techInfo?: string;
}

export class SecurityEventNotificationResponse {}

export class AuthorizationData {
  idTag: string;
  idTagInfo: IdTagInfo;
}

export class SendLocalListRequest {
  listVersion: number;
  localAuthorizationList?: AuthorizationData[];
  updateType: string;
}

export class SendLocalListResponse {
  status: SendLocalListStatus;
}

export class SetChargingProfileRequest {
  connectorId: number;
  csChargingProfiles: ChargingProfile;
}

export class SetChargingProfileResponse {
  status: SetChargingProfileStatus;
}

export class SignCertificateRequest {
  csr: string;
}

export class SignCertificateResponse {
  status: string;
}

export class SignedFirmwareStatusNotificationRequest {
  status: string;
  requestId?: number;
}

export class SignedFirmwareStatusNotificationResponse {}

export class Firmware {
  location: string;
  retrieveDateTime: string;
  installDateTime?: string;
  signingCertificate: string;
  signature: string;
}

export class SignedUpdateFirmwareRequest {
  retries?: number;
  retryInterval?: number;
  requestId: number;
  firmware: Firmware;
}

export class SignedUpdateFirmwareResponse {
  status: string;
}

export class StartTransactionRequest {
  connectorId: number;
  idTag: string;
  meterStart: number;
  reservationId?: number;
  timestamp: string;
}

export class StartTransactionResponse {
  idTagInfo: IdTagInfo;
  transactionId: number;
}

export class StatusNotificationRequest {
  connectorId: number;
  errorCode: StatusNotificationErrorCode;
  info?: string;
  status: StatusNotificationStatus;
  timestamp?: string;
  vendorId?: string;
  vendorErrorCode?: string;
}

export class StatusNotificationResponse {}

export class StopTransactionRequest {
  idTag?: string;
  meterStop: number;
  timestamp: string;
  transactionId: number;
  reason?: StopTransactionReason;
  transactionData?: MeterValue[];
}

export class StopTransactionResponse {
  idTagInfo?: IdTagInfo;
}

export class TriggerMessageRequest {
  requestedMessage: string;
  connectorId?: number;
}

export class TriggerMessageResponse {
  status: TriggerMessageStatus;
}

export class UnlockConnectorRequest {
  connectorId: number;
}

export class UnlockConnectorResponse {
  status: UnlockConnectorStatus;
}

export class UpdateFirmwareRequest {
  location: string;
  retries?: number;
  retrieveDate: string;
  retryInterval?: number;
}

export class UpdateFirmwareResponse {} 