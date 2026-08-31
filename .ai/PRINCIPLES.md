Principle 1

Platform API is the Operations Intelligence Layer.

Never use Platform API as a telemetry storage system.

--------------------

Principle 2

Grafana is the Visualization Layer.

Never rebuild dashboard capabilities inside the Platform UI.

--------------------

Principle 3

Everything external uses a Provider Interface.

CloudWatch today.

Alibaba tomorrow.

No business logic depends on vendor SDKs.

--------------------

Principle 4

OpenTelemetry and Prometheus standards first.

Avoid vendor lock-in.

--------------------

Principle 5

Every feature must improve an operator's workflow.

Do not build technology for technology's sake.