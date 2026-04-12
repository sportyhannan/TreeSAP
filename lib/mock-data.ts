import type {
  SchemaDefinition,
  FinanceRecord,
  ProcurementRecord,
  SalesRecord,
  HrRecord,
  OperationsRecord,
  ActionRequest,
} from './types'

// ── Schema definitions (for rendering) ──

export const schemas: SchemaDefinition[] = [
  {
    table: 'finance_records',
    module: 'finance',
    fields: [
      { name: 'id', type: 'uuid', constraint: 'primary key' },
      { name: 'sap_record_id', type: 'text' },
      { name: 'amount', type: 'numeric' },
      { name: 'currency_code', type: 'text' },
      { name: 'status', type: 'text', constraint: 'pending | synced | error' },
      { name: 'sensitivity_class', type: 'text', constraint: 'low | high' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
  {
    table: 'procurement_records',
    module: 'procurement',
    fields: [
      { name: 'id', type: 'uuid', constraint: 'primary key' },
      { name: 'sap_record_id', type: 'text' },
      { name: 'supplier_id', type: 'text' },
      { name: 'quantity', type: 'numeric' },
      { name: 'status', type: 'text', constraint: 'pending | synced | error' },
      { name: 'sensitivity_class', type: 'text', constraint: 'low | high' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
  {
    table: 'sales_records',
    module: 'sales',
    fields: [
      { name: 'id', type: 'uuid', constraint: 'primary key' },
      { name: 'sap_record_id', type: 'text' },
      { name: 'customer_id', type: 'text' },
      { name: 'net_amount', type: 'numeric' },
      { name: 'status', type: 'text', constraint: 'pending | synced | error' },
      { name: 'sensitivity_class', type: 'text', constraint: 'low | high' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
  {
    table: 'hr_records',
    module: 'hr',
    fields: [
      { name: 'id', type: 'uuid', constraint: 'primary key' },
      { name: 'sap_record_id', type: 'text' },
      { name: 'employee_id', type: 'text' },
      { name: 'employment_status', type: 'text' },
      { name: 'status', type: 'text', constraint: 'pending | synced | error' },
      { name: 'sensitivity_class', type: 'text', constraint: 'low | high' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
  {
    table: 'operations_records',
    module: 'operations',
    fields: [
      { name: 'id', type: 'uuid', constraint: 'primary key' },
      { name: 'sap_record_id', type: 'text' },
      { name: 'material_id', type: 'text' },
      { name: 'status', type: 'text', constraint: 'pending | synced | error' },
      { name: 'sensitivity_class', type: 'text', constraint: 'low | high' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
  {
    table: 'action_requests',
    module: 'action_requests',
    fields: [
      { name: 'id', type: 'uuid', constraint: 'primary key' },
      { name: 'source_record_id', type: 'uuid' },
      { name: 'action_type', type: 'text', constraint: 'summarize | draft | send | review' },
      { name: 'status', type: 'text', constraint: 'pending | synced | error' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
]

// ── Sample records ──

export const financeRecords: FinanceRecord[] = [
  {
    id: 'f1a2b3c4-0001-4000-a000-000000000001',
    sap_record_id: 'FI-2026-001',
    amount: 45200.0,
    currency_code: 'USD',
    status: 'synced',
    sensitivity_class: 'high',
    created_at: '2026-04-01T09:00:00Z',
    updated_at: '2026-04-01T09:05:00Z',
  },
  {
    id: 'f1a2b3c4-0001-4000-a000-000000000002',
    sap_record_id: 'FI-2026-002',
    amount: 1200.5,
    currency_code: 'EUR',
    status: 'pending',
    sensitivity_class: 'low',
    created_at: '2026-04-05T14:30:00Z',
    updated_at: '2026-04-05T14:30:00Z',
  },
]

export const procurementRecords: ProcurementRecord[] = [
  {
    id: 'p1a2b3c4-0002-4000-a000-000000000001',
    sap_record_id: 'PR-2026-001',
    supplier_id: 'SUP-100',
    quantity: 500,
    status: 'synced',
    sensitivity_class: 'low',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-20T10:10:00Z',
  },
  {
    id: 'p1a2b3c4-0002-4000-a000-000000000002',
    sap_record_id: 'PR-2026-002',
    supplier_id: 'SUP-205',
    quantity: 50,
    status: 'error',
    sensitivity_class: 'high',
    created_at: '2026-04-08T08:15:00Z',
    updated_at: '2026-04-08T08:20:00Z',
  },
]

export const salesRecords: SalesRecord[] = [
  {
    id: 's1a2b3c4-0003-4000-a000-000000000001',
    sap_record_id: 'SO-2026-001',
    customer_id: 'CUST-400',
    net_amount: 8750.0,
    status: 'pending',
    sensitivity_class: 'low',
    created_at: '2026-04-10T11:00:00Z',
    updated_at: '2026-04-10T11:00:00Z',
  },
  {
    id: 's1a2b3c4-0003-4000-a000-000000000002',
    sap_record_id: 'SO-2026-002',
    customer_id: 'CUST-312',
    net_amount: 23400.0,
    status: 'synced',
    sensitivity_class: 'high',
    created_at: '2026-04-02T16:45:00Z',
    updated_at: '2026-04-02T17:00:00Z',
  },
]

export const hrRecords: HrRecord[] = [
  {
    id: 'h1a2b3c4-0004-4000-a000-000000000001',
    sap_record_id: 'HR-2026-001',
    employee_id: 'EMP-1001',
    employment_status: 'active',
    status: 'synced',
    sensitivity_class: 'high',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'h1a2b3c4-0004-4000-a000-000000000002',
    sap_record_id: 'HR-2026-002',
    employee_id: 'EMP-1042',
    employment_status: 'on_leave',
    status: 'pending',
    sensitivity_class: 'high',
    created_at: '2026-04-09T12:00:00Z',
    updated_at: '2026-04-09T12:00:00Z',
  },
]

export const operationsRecords: OperationsRecord[] = [
  {
    id: 'o1a2b3c4-0005-4000-a000-000000000001',
    sap_record_id: 'OP-2026-001',
    material_id: 'MAT-700',
    status: 'synced',
    sensitivity_class: 'low',
    created_at: '2026-03-28T07:30:00Z',
    updated_at: '2026-03-28T07:45:00Z',
  },
  {
    id: 'o1a2b3c4-0005-4000-a000-000000000002',
    sap_record_id: 'OP-2026-002',
    material_id: 'MAT-815',
    status: 'pending',
    sensitivity_class: 'low',
    created_at: '2026-04-11T13:00:00Z',
    updated_at: '2026-04-11T13:00:00Z',
  },
]

export const sampleActionRequests: ActionRequest[] = [
  {
    id: 'ar-0001',
    source_record_id: 's1a2b3c4-0003-4000-a000-000000000001',
    action_type: 'send',
    status: 'pending',
    created_at: '2026-04-10T11:05:00Z',
    updated_at: '2026-04-10T11:05:00Z',
  },
  {
    id: 'ar-0002',
    source_record_id: 'f1a2b3c4-0001-4000-a000-000000000001',
    action_type: 'summarize',
    status: 'synced',
    created_at: '2026-04-01T09:10:00Z',
    updated_at: '2026-04-01T09:12:00Z',
  },
]

// All records grouped by module for easy iteration
export const allRecordsByModule = {
  finance: financeRecords,
  procurement: procurementRecords,
  sales: salesRecords,
  hr: hrRecords,
  operations: operationsRecords,
} as const

export const moduleLabels: Record<string, string> = {
  finance: 'Finance',
  procurement: 'Procurement',
  sales: 'Sales',
  hr: 'HR',
  operations: 'Operations',
  action_requests: 'Action Requests',
}
