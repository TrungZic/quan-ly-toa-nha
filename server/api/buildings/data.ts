export interface Building {
  id?: number | string | null
  name: string
  address: string
  representative: string
  phone: string
  cccd: string
  cccdDate: string

  lat: number
  lng: number
}
export const buildings: Building[] = [
  {
    id: 1,
    name: 'Keangnam',
    address: 'Nam Từ Liêm - Hà Nội',
    representative: 'Nguyễn Văn A',
    phone: '0901234567',
    cccd: '012345678901',
    cccdDate: '2020-01-01',
    lat: 21.017415,
    lng: 105.782735
  },
  {
    id: 2,
    name: 'Tòa nhà Lim Tower',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị B',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15',
    lat: 21.033333,
    lng: 105.814167
  },
  {
    id: 3,
    name: 'Tòa nhà VinKe',
    address: 'Hai Bà Trưng - Hà Nội',
    representative: 'Hoàng Văn Trung',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15',
    lat: 20.996746996400226,
    lng: 105.86845314384604
  },

  {
    id: 4,
    name: 'Tòa nhà VinCom',
    address: 'Hai Bà Trưng - Hà Nội',
    representative: 'Trần Thị Dung',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15',
    lat: 21.011278481327835, 
    lng: 105.85087150632741
  },
  {
    id: 5,
    name: 'Tòa nhà Lim Tower 3',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị C',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15',
    lat: 21.034600,
    lng: 105.815200
  },
  {
    id: 6,
    name: 'Tòa nhà Lim Tower 4',
    address: 'Ba Đình - Hà Nội',
    representative: 'Trần Thị G',
    phone: '0912345678',
    cccd: '123456789012',
    cccdDate: '2021-05-15',
    lat: 21.033800,
    lng: 105.816000
  }
]

export default buildings
