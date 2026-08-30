# Brief de Producto

V2: Segunda entrega, se agregan los puntos que incorporan el perfil del usuario real, necesidades, problemas y contexto de uso relevados, la hipótesis de valor, y el estado de los supuestos (puntos del 6 al 11).

2. Elección del segmento y comprobación del acceso

2.1 Segmento elegido
El segmento está compuesto aproximadamente por 2.000 afiliados y usuarios actuales o potenciales del gimnasio de la UNLaM. Se trata de un grupo específico dentro de la comunidad universitaria, diferenciado por su relación directa con las actividades y servicios ofrecidos por el gimnasio.
Este segmento se caracteriza por ser un grupo de estudiantes que, además de sus actividades académicas, realizan actividad física dentro de las instalaciones de la UNLaM o también interesados en asistir al gimnasio sin necesidad de ser estudiantes de la universidad. Los usuarios presentan la necesidad de acceder de manera sencilla a la información relacionada con sus entrenamientos, conocer las rutinas asignadas por los entrenadores, registrar su asistencia y gestionar el pago de la suscripción al gimnasio.

2.2 Usuarios reales

Usuario  Rol                    Forma de contacto                              Relación previa con el equipo                       Disponibilidad TP2  Disponibilidad TP5
U1       Alumno/a del gimnasio  Contacto personal / presencial en el gimnasio  Compañero/a de cursada de uno de los integrantes    Confirmada          Confirmada
U2       Alumno/a del gimnasio  Contacto personal / WhatsApp                   Amigo/a de uno de los integrantes                   Confirmada          Confirmada
U3       Alumno/a del gimnasio  Contacto presencial en el gimnasio             Conocido/a de uno de los integrantes                Confirmada          Confirmada

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

6. Perfil del usuario
Los usuarios encuestados tienen principalmente entre 21 y 28 años. 
De las 6 personas, 4 personas asisten entre 2-3 veces por semana y 2 entre 4-5 veces. La mayoría tiene una rutina definida y utiliza el celular durante el entrenamiento, principalmente para ver sus rutinas, escuchar música o utilizar herramientas como el cronómetro. Esto muestra que el celular ya forma parte habitual del entrenamiento.

7. Necesidades reales
Los resultados muestran la necesidad de contar con un lugar centralizado para consultar y registrar la rutina, ya que actualmente los usuarios recurren a la memoria, notas del celular o distintas aplicaciones. También existe una necesidad de registrar y visualizar el progreso, ya que la mayoría no lo hace de manera constante ni consulta registros anteriores. Además, necesitan una forma más sencilla de guardar las indicaciones de los profesores y recibir información sobre el abono de la cuota del gimnasio.

8. Problemas y frustraciones concretas
Uno de los principales problemas detectados es la dependencia de la memoria. 5 de los 6 encuestados indicaron que alguna vez olvidaron ejercicios, pesos, series o repeticiones que debían realizar. Además, 3 personas manifestaron haberse olvidado alguna indicación del profesor. El seguimiento del progreso también presenta dificultades: la mayoría lo realiza de manera ocasional y 4 de 6 personas no consultan registros anteriores. En cuanto a la gestión de la cuota, 4 personas indicaron haber olvidado pagarla alguna vez, mientras que la mayoría se entera de los aumentos recién al momento de pagar.

9.Contexto de uso
El principal contexto de uso sería dentro del gimnasio, durante el entrenamiento, utilizando el celular. El usuario necesita consultar rápidamente su rutina, ejercicios, pesos o indicaciones entre series, por lo que la información debería estar disponible de manera simple y con pocos pasos. También existiría un contexto de uso fuera del gimnasio, principalmente para consultar información sobre la cuota, vencimientos y recibir recordatorios.

10. Estado de los supuestos
Supuesto 1: CONFIRMADO -> (P9) El 83,3% (5/6) reconoció haber olvidado alguna vez un ejercicio, peso o cantidad de repeticiones. (P6) El 50% anota la rutina en notas sueltas del celular, el 33,3% se la acuerda de memoria y el 0% usa papel. Hay que corregir el supuesto original: el problema es real, pero el medio equivocado

Supuesto 2: CONFIRMADO -> (P24) La encuesta relevó el medio actual de pago: 50% efectivo, 33,3% billetera virtual, 16,7% tarjeta. Lo que sí surgió con fuerza es que (P25 y P26): el 66,7% se olvidó de pagar la cuota alguna vez y el 100% se entera de los aumentos recién al momento de pagar. El dolor no es "cómo pago" sino "no me avisan a tiempo". Conviene sumar al supuesto notificaciones sobre esto.

Supuesto 3: CONFIRMADO -> (P11 y P12) 83,3% (5/6) usa el celular mientras entrena, principalmente para ver la rutina, usar el cronómetro y escuchar música.

Supuesto 4: NO CONFIRMADO -> La técnica elegida (encuesta) se aplicó solo a alumnos/afiliados, no a entrenadores. Este supuesto queda fuera de esta validación.

Supuesto 5: CONFIRMADO ->  (P23) El 100% carece de un método estructurado de registro de asistencia (66,7% "recuerda aproximadamente", 33,3% no lleva ningún registro), y el 66,7% no consulta registros anteriores de su progreso (P15). Hay una carencia real.

Supuesto 6 (Crítico): CONFIRMADO -> (P22) 83,3% calificó con 4 o 5 (sobre 5) la utilidad de recibir indicaciones del profesor vía app, y 83,3% calificó igual de útil recibir información sobre la cuota en el celular (P28), con el 66,7% marcando el máximo (5). Sumado al 100% que hoy se entera de los aumentos "al momento de pagar", hay una brecha clara entre lo que pasa hoy y lo que valorarían tener.

¿Qué apareció que no estaba previsto?
Nadie usa papel para nada (rutina, progreso, asistencia): el canal real es "memoria informal", distinto al supuesto original.

El 80% de los que tienen rutina definida la arma por su cuenta, y solo el 60% depende del profesor (P5), esto sugiere que el producto necesita contemplar rutinas autogestionadas, no solo asignadas por un entrenador.

Una respuesta abierta (P10) señaló que las apps existentes son tediosas por tener los ejercicios en inglés.
El punto de dolor de la cuota no es el medio de pago sino la falta de aviso previo (aumentos, vencimientos).

¿Qué pasó con el supuesto crítico? 
El supuesto crítico se confirmó. La evidencia relevada (P22 y P28) mostró que el 83,3% de los encuestados calificó con 4 o 5 (sobre 5) la utilidad de recibir tanto indicaciones del entrenador como información de la cuota a través de una app en el celular, y el 100% señaló que hoy se entera de los aumentos de cuota recién al momento de pagar — es decir, no hay ningún mecanismo proactivo actual que cubra esa necesidad.

¿El usuario primario sigue siendo el correcto? 
Sí. El relevamiento confirma que el afiliado/alumno del gimnasio tiene el problema con fuerza (olvidos, falta de seguimiento, falta de aviso de cuota) y una alta receptividad a una solución centralizada.

11. Hipótesis de valor
Creemos que los alumnos/afiliados del gimnasio de la UNLaM que entrenan de forma regular (2 a 5 veces por semana)

tienen el problema de depender de la memoria y de canales dispersos e informales (notas sueltas en el celular, indicaciones verbales del profesor) para recordar su rutina, hacer seguimiento de su progreso y enterarse a tiempo del estado de su cuota, lo que genera olvidos frecuentes de ejercicios (83%), falta de seguimiento de su historial de progreso (67% no lo consulta) y sorpresas con la cuota (67% se olvidó de pagar alguna vez, 100% se entera de los aumentos recién al pagar).

Nuestra solución es UNLaM-Gym, una plataforma web que centraliza la consulta de rutinas (asignadas por el entrenador o cargadas por el propio alumno), el registro de asistencia y progreso, y las notificaciones sobre el estado y vencimiento de la cuota.

Sabremos que estamos en lo correcto cuando al menos el 80% de los usuarios que prueben el MVP logren consultar su rutina y registrar su asistencia sin ayuda externa durante la primera semana de uso, y valoren con 4 o más (sobre 5) la utilidad de las notificaciones de rutina y cuota.


