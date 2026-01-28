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
  },
  {
    id: 3,
    name: 'Tòa nhà Lim Tower 1',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị T',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15'
  },
    {
    id: 4,
    name: 'Tòa nhà Lim Tower 2',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị D',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15'
  },
    {
    id: 5,
    name: 'Tòa nhà Lim Tower 3',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị C',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15'
  },
    {
    id: 6,
    name: 'Tòa nhà Lim Tower 4',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị G',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15'
  }
]
export default buildings