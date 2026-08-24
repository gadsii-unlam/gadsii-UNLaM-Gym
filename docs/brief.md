# Brief de Producto

TP 1:

2. Segmento elegido
El segmento seleccionado de la Universidad Nacional de La Matanza (UNLaM) está compuesto por los alumnos o miembros de la comunidad que utilizan o tienen interés en utilizar el gimnasio de la Universidad, considerando principalmente a aquellos que realizan actividades de entrenamiento físico y requieren organizar y realizar un seguimiento de sus rutinas y concurrencia.
Este segmento se caracteriza por ser un grupo de estudiantes que, además de sus actividades académicas, realizan actividad física dentro de las instalaciones de la UNLaM o también interesados en asistir al gimnasio sin necesidad de ser estudiantes de la universidad. Los usuarios presentan la necesidad de acceder de manera sencilla a la información relacionada con sus entrenamientos, conocer las rutinas asignadas por los entrenadores, registrar su asistencia y gestionar el pago de la suscripción al gimnasio.
El segmento se encuentra acompañado por otros actores directamente relacionados con el funcionamiento del gimnasio, principalmente los entrenadores encargados de diseñar y asignar las rutinas de entrenamiento y los administradores responsables de gestionar los ejercicios, usuarios y aspectos generales de la plataforma.

3. Definición del producto

3.1. Nombre del producto
El producto se denominará UNLaM-Gym, una plataforma web orientada a la gestión y seguimiento de la actividad de los alumnos del gimnasio de la Universidad Nacional de La Matanza.

3.2. Problema que resuelve
UNLaM-Gym busca resolver la falta de una plataforma centralizada para gestionar las principales actividades relacionadas con el funcionamiento del gimnasio de la UNLaM.
Actualmente, las distintas tareas vinculadas con el entrenamiento pueden requerir diferentes medios de comunicación y registro. Los alumnos necesitan conocer la rutina que les fue asignada, registrar su concurrencia y gestionar el pago de su suscripción. Por otro lado, los entrenadores necesitan disponer de una herramienta que les permita administrar las rutinas de sus alumnos de manera organizada, mientras que los administradores requieren mecanismos para gestionar el funcionamiento general del sistema.
UNLaM-Gym propone centralizar estas actividades en una única plataforma web, permitiendo que cada usuario acceda a las funcionalidades correspondientes a su rol.

3.3. ¿A quién le resuelve el problema?
El producto está dirigido principalmente a los alumnos/afiliados que utilizan el gimnasio de la UNLaM, quienes podrán consultar sus rutinas, registrar su asistencia y gestionar el pago de su suscripción.

3.4. Funcionalidades principales
Las funcionalidades del sistema se organizan según los distintos roles de usuario.
Alumnos/Afiliados:
  Registrarse e iniciar sesión en la plataforma.
  Consultar el estado de su suscripción.
  Realizar el pago de la suscripción mediante una integración con Mercado Pago.
  Consultar la rutina de entrenamiento asignada por su entrenador.
  Visualizar la rutina organizada por días.
  Consultar los ejercicios correspondientes a cada día, incluyendo cantidad de repeticiones y series.
  Registrar los días en los que asistieron al gimnasio.
  Consultar un historial de sus asistencias.
  Visualizar su progreso y evolución a lo largo del tiempo.
  Recibir notificaciones relacionadas con su rutina, suscripción o información importante del gimnasio.
Entrenadores:
  Iniciar sesión con su cuenta.
  Consultar los alumnos que tienen asignados.
  Crear rutinas de entrenamiento.
  Definir la cantidad de días que tendrá una rutina.
  Incorporar diferentes ejercicios a cada día.
  Establecer para cada ejercicio la cantidad de series y repeticiones.
  Asignar una rutina a un alumno.
  Modificar una rutina existente.
  Consultar el historial de rutinas asignadas.
  Visualizar el seguimiento de asistencia de sus alumnos.
Administradores:
  Gestionar los usuarios de la plataforma.
  Administrar entrenadores y alumnos.
  Cargar nuevos ejercicios.
  Modificar o deshabilitar ejercicios existentes.
  Administrar información general del gimnasio.
  Consultar el estado de las suscripciones.
  Consultar información general de pagos y asistencias.
  Gestionar permisos y roles de los usuarios.

3.5. Funcionalidades core
1. Gestión y asignación de rutinas: Es la funcionalidad central del producto. Permite a los entrenadores crear rutinas compuestas por diferentes días y ejercicios, definiendo para cada ejercicio parámetros como series y repeticiones, y posteriormente asignarlas a los alumnos.
2. Consulta de rutinas por parte del alumno: Los alumnos podrán acceder desde la plataforma a la rutina que tienen asignada y consultar qué ejercicios deben realizar en cada día, junto con sus respectivas series y repeticiones.
3. Registro y seguimiento de asistencia: El alumno podrá registrar su concurrencia al gimnasio y consultar posteriormente un historial de sus asistencias. Esto permitirá llevar un seguimiento de la constancia del entrenamiento.
4. Gestión de la suscripción y pagos: La plataforma permitirá consultar el estado de la suscripción y realizar el pago correspondiente de manera digital mediante una integración con Mercado Pago.
5. Administración del catálogo de ejercicios: Los administradores podrán incorporar y gestionar los ejercicios disponibles en la plataforma, permitiendo que posteriormente los entrenadores puedan utilizarlos para construir las rutinas.

3.6. Integraciones tecnológicas
La principal integración prevista será con Mercado Pago, que permitirá gestionar el pago digital de las suscripciones de los alumnos. 
A través de la API de Mercado Pago, el sistema podrá generar y procesar las operaciones de pago y posteriormente actualizar el estado de la suscripción del alumno según el resultado de la operación. Esta integración es necesaria porque permite incorporar al producto una funcionalidad de pago real sin desarrollar desde cero un sistema propio de procesamiento de pagos.
Además, UNLaM-Gym contará con un backend y un frontend desarrollados por el equipo. El backend será responsable de gestionar usuarios, roles, rutinas, ejercicios, asistencias y suscripciones, mientras que el frontend permitirá a alumnos, entrenadores y administradores interactuar con el sistema de acuerdo con sus permisos.
De esta manera, el producto cumple con los dos requisitos técnicos planteados: desarrollo de software propio e integración con un servicio externo.

4. Grupos de usuarios
Alumnos/Afiliados: Personas que utilizan el gimnasio de la UNLaM y realizan actividades de entrenamiento físico. Son los principales destinatarios del producto y quienes tienen una interacción más frecuente con la plataforma.
Su relación con el problema es directa, ya que necesitan consultar las rutinas asignadas por los entrenadores, conocer los ejercicios que deben realizar, registrar su concurrencia, realizar el pago de su suscripción y realizar un seguimiento de su actividad.
Su principal motivación para utilizar UNLaM-Gym es centralizar la información relacionada con su entrenamiento y facilitar la gestión de su actividad en el gimnasio, pudiendo acceder a su rutina, registrar sus asistencias y gestionar su suscripción desde un único lugar.

Administradores: Los administradores son los responsables de gestionar y controlar el funcionamiento general de UNLaM-Gym.
Su relación con el problema se encuentra vinculada con la administración de la plataforma y de la información utilizada por los demás usuarios. Entre sus responsabilidades se encuentran la gestión de afiliados y entrenadores, la administración del catálogo de ejercicios, el control de las suscripciones y la gestión de los permisos y roles.
Su principal motivación para utilizar UNLaM-Gym es centralizar y simplificar la administración del gimnasio, disponiendo de información organizada y herramientas que permitan controlar el funcionamiento general de la plataforma.

Entrenadores: Personas encargadas de las actividades del gimnasio.
Se relacionan con la planificación y seguimiento de las actividades de los alumnos y con la comunicación de información relacionada con el entrenamiento.
Su motivación es facilitar a los socios del gimnasio la comunicación, gestionar rutinas y disponer de información organizada sobre su actividad.
Grupo de usuarios primario

El grupo de usuarios primario seleccionado será el de Afiliados del gimnasio.
La elección se debe a que este grupo presenta la relación más directa y frecuente con el problema que busca resolver UNLaM-Gym. Los afiliados son quienes utilizarán la plataforma para consultar sus rutinas, registrar su concurrencia, realizar el seguimiento de su actividad y gestionar el pago de su suscripción.

5. Supuestos
Supuesto 1: "Asumimos que los alumnos del gimnasio de la UNLaM tienen dificultades para consultar o recordar sus rutinas con los métodos que se utilizan actualmente (papel, WhatsApp o memoria)."
Evidencia para comprobarlo: Entrevistas a los usuarios (como los identificados U1, U2 y U3) para que describan cómo consultan su rutina hoy y si les resulta incómodo o ineficiente.

Supuesto 2: "Asumimos que los afiliados prefieren abonar su suscripción de manera digital mediante Mercado Pago por sobre el pago presencial o en efectivo."
Evidencia para comprobarlo: Encuestas a los alumnos del gimnasio sobre sus métodos de pago preferidos y análisis de la tasa de uso de pagos digitales frente a presenciales.

Supuesto 3: "Asumimos que los alumnos tienen consigo su teléfono celular durante el entrenamiento y lo utilizan activamente para consultar información."
Evidencia para comprobarlo: Observación directa en las instalaciones del gimnasio de la UNLaM durante distintos horarios para verificar si los usuarios efectivamente manipulan sus dispositivos mientras entrenan.

Supuesto 4: "Asumimos que a los entrenadores les resulta complejo o les consume mucho tiempo administrar y asignar las rutinas de sus alumnos sin una herramienta unificada."
Evidencia para comprobarlo: Entrevistas con los entrenadores del gimnasio preguntándoles sobre sus "puntos de dolor" actuales al momento de diseñar y hacer seguimiento de las rutinas de múltiples alumnos.

Supuesto 5: "Asumimos que a los afiliados les interesa registrar su concurrencia diaria para tener un historial de asistencias y ver su progreso."
Evidencia para comprobarlo: Validación mediante encuestas de interés o midiendo la interacción con un prototipo (MVP) para ver si los usuarios realmente ingresan voluntariamente el dato de su asistencia.

Supuesto 6: "Asumimos que la falta de centralización es un problema suficientemente molesto como para que los alumnos y entrenadores decidan adoptar una nueva plataforma web."
Evidencia para comprobarlo: Presentación de un MVP (Producto Mínimo Viable) a los usuarios para medir si se registran y completan el flujo principal de tareas (ver rutina, registrar asistencia) en lugar de abandonar la app.

Supuesto Crítico
El Supuesto Crítico de este proyecto es el Supuesto 6: "Asumimos que la falta de centralización es un problema suficientemente molesto como para que los alumnos y entrenadores decidan adoptar una nueva plataforma web."


