// Local storage based data service (replaces Wix CMS)

type Item = { _id: string; [key: string]: any }

function getStore<T extends Item>(entity: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(`qinv_${entity}`) || '[]')
  } catch {
    return []
  }
}

function setStore<T extends Item>(entity: string, items: T[]) {
  localStorage.setItem(`qinv_${entity}`, JSON.stringify(items))
}

// Seed demo data on first load
function seedIfEmpty() {
  if (!localStorage.getItem('qinv_seeded')) {
    // Inventory Items
    setStore('inventoryitems', [
      { _id: '1', itemName: 'Steel Rods', description: 'Grade A steel rods', currentStock: 450, safetyStock: 100, leadTime: 7, unitOfMeasure: 'kg', plannedRate: 85 },
      { _id: '2', itemName: 'Aluminium Sheets', description: 'Thin aluminium panels', currentStock: 80, safetyStock: 90, leadTime: 5, unitOfMeasure: 'pcs', plannedRate: 220 },
      { _id: '3', itemName: 'Copper Wire', description: '2mm copper wire', currentStock: 0, safetyStock: 50, leadTime: 3, unitOfMeasure: 'm', plannedRate: 45 },
      { _id: '4', itemName: 'Plastic Granules', description: 'HDPE granules', currentStock: 1200, safetyStock: 200, leadTime: 14, unitOfMeasure: 'kg', plannedRate: 32 },
      { _id: '5', itemName: 'Rubber Gaskets', description: 'Industrial gaskets', currentStock: 340, safetyStock: 50, leadTime: 4, unitOfMeasure: 'pcs', plannedRate: 12 },
      { _id: '6', itemName: 'Bearings 6205', description: 'Deep groove ball bearings', currentStock: 55, safetyStock: 60, leadTime: 10, unitOfMeasure: 'pcs', plannedRate: 95 },
    ])

    // System Alerts
    setStore('systemalerts', [
      { _id: 'a1', message: 'Aluminium Sheets stock below safety threshold', severity: 'High', type: 'Stock', isRead: false, generatedAt: new Date(Date.now()-3600000).toISOString() },
      { _id: 'a2', message: 'Copper Wire is completely out of stock', severity: 'Critical', type: 'Stock', isRead: false, generatedAt: new Date(Date.now()-7200000).toISOString() },
      { _id: 'a3', message: 'Bearings 6205 approaching safety stock', severity: 'Warning', type: 'Stock', isRead: false, generatedAt: new Date(Date.now()-14400000).toISOString() },
      { _id: 'a4', message: 'Production Plan PP-2024-05 approved', severity: 'Info', type: 'System', isRead: true, generatedAt: new Date(Date.now()-86400000).toISOString() },
    ])

    // Production Plans
    setStore('productionplans', [
      { _id: 'p1', planIdentifier: 'PLAN-2024-001', itemName: 'Steel Rods', plannedQuantity: 500, plannedRate: 85, planningDate: '2024-01-15', notes: 'Q1 production batch' },
      { _id: 'p2', planIdentifier: 'PLAN-2024-002', itemName: 'Plastic Granules', plannedQuantity: 800, plannedRate: 32, planningDate: '2024-01-20', notes: '' },
    ])

    // Actual Consumption
    setStore('actualconsumption', [
      { _id: 'c1', itemSKU: 'SKU-001', itemName: 'Steel Rods', actualQuantity: 480, actualRate: 87, consumptionDateTime: '2024-01-16T10:00', unitOfMeasure: 'kg' },
      { _id: 'c2', itemSKU: 'SKU-003', itemName: 'Plastic Granules', actualQuantity: 820, actualRate: 31, consumptionDateTime: '2024-01-21T14:00', unitOfMeasure: 'kg' },
    ])

    // Orders
    setStore('orders', [
      { _id: 'o1', orderNumber: 'ORD-001', vendor: 'SteelCorp', totalQuantity: 1000, totalValue: 85000, status: 'delivered', createdAt: '2024-01-10' },
      { _id: 'o2', orderNumber: 'ORD-002', vendor: 'PlasticHub', totalQuantity: 2000, totalValue: 64000, status: 'pending', createdAt: '2024-01-18' },
    ])

    localStorage.setItem('qinv_seeded', 'true')
  }
}

seedIfEmpty()

export const DataService = {
  getAll: async <T extends Item>(entity: string): Promise<{ items: T[] }> => {
    await new Promise(r => setTimeout(r, 200)) // simulate latency
    return { items: getStore<T>(entity) }
  },

  create: async <T extends Item>(entity: string, item: T): Promise<T> => {
    const items = getStore<T>(entity)
    items.unshift(item)
    setStore(entity, items)
    return item
  },

  update: async <T extends Item>(entity: string, partial: Partial<T> & { _id: string }): Promise<T> => {
    const items = getStore<T>(entity)
    const idx = items.findIndex(i => i._id === partial._id)
    if (idx !== -1) items[idx] = { ...items[idx], ...partial }
    setStore(entity, items)
    return items[idx]
  },

  delete: async (entity: string, id: string): Promise<void> => {
    const items = getStore(entity)
    setStore(entity, items.filter(i => i._id !== id))
  },
}
