// SAP Module types
export type ModuleSlug = 'finance' | 'procurement' | 'sales' | 'hr' | 'operations'
export type RecordStatus = 'pending' | 'synced' | 'error'
export type SensitivityClass = 'low' | 'high'
export type ActionType = 'summarize' | 'draft' | 'send' | 'review'

// Schema field definition (for rendering schema tables)
export interface SchemaField {
  name: string
  type: string
  constraint?: string
}

export interface SchemaDefinition {
  table: string
  module: ModuleSlug | 'action_requests'
  fields: SchemaField[]
}

// Record types
export interface FinanceRecord {
  id: string
  sap_record_id: string
  amount: number
  currency_code: string
  status: RecordStatus
  sensitivity_class: SensitivityClass
  created_at: string
  updated_at: string
}

export interface ProcurementRecord {
  id: string
  sap_record_id: string
  supplier_id: string
  quantity: number
  status: RecordStatus
  sensitivity_class: SensitivityClass
  created_at: string
  updated_at: string
}

export interface SalesRecord {
  id: string
  sap_record_id: string
  customer_id: string
  net_amount: number
  status: RecordStatus
  sensitivity_class: SensitivityClass
  created_at: string
  updated_at: string
}

export interface HrRecord {
  id: string
  sap_record_id: string
  employee_id: string
  employment_status: string
  status: RecordStatus
  sensitivity_class: SensitivityClass
  created_at: string
  updated_at: string
}

export interface OperationsRecord {
  id: string
  sap_record_id: string
  material_id: string
  status: RecordStatus
  sensitivity_class: SensitivityClass
  created_at: string
  updated_at: string
}

export interface ActionRequest {
  id: string
  source_record_id: string
  action_type: ActionType
  status: RecordStatus
  created_at: string
  updated_at: string
}

export type ModuleRecord = FinanceRecord | ProcurementRecord | SalesRecord | HrRecord | OperationsRecord
