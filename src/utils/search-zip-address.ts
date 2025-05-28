import axios from "axios";


type ZipCodeViaCEPResponse={
    "cep":string
    "logradouro":string
    "complemento":string
    "unidade":string
    "bairro":string
    "localidade":string
    "uf":string
    "estado":string
    "regiao":string
    "ibge":string
    "gia":string
    "ddd":string
    "siafi":string
  }
export async function searchByZipCode(zip:string) {
    const response = await axios<ZipCodeViaCEPResponse>({
        baseURL:`https://viacep.com.br/ws/${zip}/json/`,
        method:'GET'
    })

    return response.data
    
}