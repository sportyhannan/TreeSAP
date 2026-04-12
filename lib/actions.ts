'use server'

import { supabase } from './supabase'
import { generateAIResponse } from './lava'
import { revalidatePath } from 'next/cache'
import type { ModuleSlug, ActionType } from './types'

const moduleTableMap: Record<ModuleSlug, string> = {
  finance: 'finance',
  procurement: 'procurement',
  sales: 'sales',
  hr: 'hr',
  operations: 'operations',
}

export async function triggerAction(
  sourceRecordId: string,
  module: ModuleSlug,
  actionType: ActionType
) {
  // 1. Insert action_request as pending
  const { data: actionRequest, error: insertError } = await supabase
    .from('action_requests')
    .insert({
      source_record_id: sourceRecordId,
      action_type: actionType,
      status: 'pending',
    })
    .select()
    .single()

  if (insertError) throw new Error(insertError.message)

  // 2. Fetch the source record
  const table = moduleTableMap[module]
  const { data: record, error: fetchError } = await supabase
    .from(table)
    .select('*')
    .eq('id', sourceRecordId)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  // 3. Route through Lava to AI model
  let aiOutput: string
  try {
    aiOutput = await generateAIResponse(module, actionType, record)
  } catch (err) {
    // Update action request to error
    await supabase
      .from('action_requests')
      .update({ status: 'error', updated_at: new Date().toISOString() })
      .eq('id', actionRequest.id)

    throw err
  }

  // 4. Store AI output and mark as synced
  const { error: updateError } = await supabase
    .from('action_requests')
    .update({
      ai_output: aiOutput,
      status: 'synced',
      updated_at: new Date().toISOString(),
    })
    .eq('id', actionRequest.id)

  if (updateError) throw new Error(updateError.message)

  revalidatePath('/workflow/live')
  return { id: actionRequest.id, ai_output: aiOutput, status: 'synced' }
}

export async function approveAction(actionRequestId: string) {
  const { error } = await supabase
    .from('action_requests')
    .update({ status: 'synced', updated_at: new Date().toISOString() })
    .eq('id', actionRequestId)

  if (error) throw new Error(error.message)
  revalidatePath('/workflow/live')
}

export async function rejectAction(actionRequestId: string) {
  const { error } = await supabase
    .from('action_requests')
    .update({ status: 'error', updated_at: new Date().toISOString() })
    .eq('id', actionRequestId)

  if (error) throw new Error(error.message)
  revalidatePath('/workflow/live')
}
