export interface Building {
  id?: number | string | null
  name: string
  address: string
  representative: string
  phone: string
  cccd: string
  cccdDate: string
}

export const buildings: Building[] = [
  {
    id: 1,
    name: 'Keangnam',
    address: 'Nam Từ Liêm - Hà Nội',
    representative: 'Nguyễn Văn A',
    phone: '0901234567',
    cccd: '012345678901',
    cccdDate: '2020-01-01'
  },
  {
    id: 2,
    name: 'Tòa nhà Lim Tower',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị B',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15'
  }
]
export default buildings