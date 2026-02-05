export interface Building {
  id?: number | string | null

  name: string
  address: string
  representative: string
  phone: string
  cccd: string
  cccdDate: string

  lat?: number   
  lng?: number  
}
