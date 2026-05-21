import { Injectable } from '@angular/core';

export const RAZAS: Record<string, string[]> = {
  bovino: ['Holstein','Jersey','Guernsey','Ayrshire','Gelvich','Indubrásil','Gyr','Brahaman','Nelore','Guzerat','Sardo Negro','Santa Gertrudis','Limousin','Salers','Senepol','Chianina','Charolais','Simbrah','Hereford','Suizo Europeo','Aberdeen Angus','Angus','Red Poll','Cruza','Criollo','Suizo Americano','Simmental','Maine Anjou','Beef Master','Marchigiana','Brangus','Braford','Wagyu','Normando','Varias'],
  porcino: ['Duroc','Yorkshire','Poland China','Spot','Landrace','Camborough','Pietrain','Hampshire','Cruza','Criollo','Híbrido'],
  avicola: ['Arbor Acres','Cobb 100 Plus','Hubbard','Indian River','Ross 1','Shaver Starbro','Babcock B-300V','Hisex Blanca','HY-Line W-36','Vantress'],
};

export const PROPOSITOS: Record<string, string[]> = {
  bovino: ['Lechero','Engorde','Crianza','Doble propósito'],
  porcino: ['Reproducción','Engorde'],
  avicola: ['Postura','Engorda'],
};

export const DEPTOS: string[] = [
  'Alta Verapaz','Baja Verapaz','Chimaltenango','Chiquimula','El Progreso',
  'Escuintla','Guatemala','Huehuetenango','Izabal','Jalapa','Jutiapa',
  'Petén','Quetzaltenango','Quiché','Retalhuleu','Sacatepéquez',
  'San Marcos','Santa Rosa','Sololá','Suchitepéquez','Totonicapán','Zacapa',
];

export const MUNICIPIOS: Record<string, string[]> = {
  'Escuintla': ['Escuintla','Masagua','La Democracia','Siquinalá','Nueva Concepción','Santa Lucía Cotzumalguapa','La Gomera','Guanagazapa'],
  'Guatemala': ['Guatemala','Villa Nueva','Mixco','San Juan Sacatepéquez','Amatitlán','Villa Canales','San Pedro Ayampuc','Petapa'],
  'Petén': ['Flores','San Andrés','La Libertad','Santa Ana','San Benito','Melchor de Mencos','Poptún','San Luis'],
  'Izabal': ['Puerto Barrios','Morales','Los Amates','Livingston','El Estor'],
  'Alta Verapaz': ['Cobán','Santa Cruz Verapaz','San Cristóbal','Tactic','Panzós','Tucurú'],
  'Retalhuleu': ['Retalhuleu','Champerico','San Marcos','San Sebastián','El Asintal'],
  'Quetzaltenango': ['Quetzaltenango','Coatepeque','Génova','El Palmar','San Carlos Sija'],
  'San Marcos': ['San Marcos','Malacatán','Pajapita','Tecún Umán','Catarina','Ocós'],
  'Zacapa': ['Zacapa','Gualán','Teculután','Río Hondo','Usumatlán'],
  'Huehuetenango': ['Huehuetenango','La Libertad','Jacaltenango','Nentón','San Pedro Necta'],
  'Jalapa': ['Jalapa','Monjas','San Pedro Pinula','Mataquescuintla'],
  'Jutiapa': ['Jutiapa','El Progreso','Jalpatagua','Asunción Mita','Atescatempa'],
  'Santa Rosa': ['Cuilapa','Barberena','Taxisco','Guazacapán','Chiquimulilla'],
  'Suchitepéquez': ['Mazatenango','Patulul','San Antonio','Chicacao','Río Bravo'],
  'Chiquimula': ['Chiquimula','Jocotán','Camotán','Esquipulas','Quezaltepeque'],
};

export const AGENCIAS: string[] = [
  'Agencia Central Guatemala','Agencia Escuintla','Agencia Quetzaltenango',
  'Agencia Petén Flores','Agencia Puerto Barrios','Agencia Retalhuleu',
  'Agencia Coatepeque','Agencia Cobán','Agencia Zacapa','Agencia Huehuetenango',
  'Agencia Jutiapa','Agencia Jalapa','Agencia Mazatenango','Agencia Santa Rosa',
  'Agencia San Marcos','Agencia Chiquimula','Agencia Morales','Agencia Malacatán',
  'Agencia Villa Nueva',
];

@Injectable({ providedIn: 'root' })
export class DataService {
  filter(list: string[], query: string): string[] {
    const q = query.toLowerCase().trim();
    return q ? list.filter(i => i.toLowerCase().includes(q)).slice(0, 12) : list.slice(0, 12);
  }
  getMunicipios(depto: string): string[] {
    return MUNICIPIOS[depto] ?? Object.values(MUNICIPIOS).flat();
  }
}
