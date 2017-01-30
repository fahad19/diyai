export default function createContainer(providers = [], opts = {}) {
  const options = {
    containerName: 'container',
    ...opts,
  };

  class Container {
    constructor() {
      // name ==> instance
      this.registry = {
        [options.containerName]: this
      };

      providers.forEach((provider) => {
        this.register(provider);
      });
    }

    register(provider) {
      if (typeof provider.name !== 'string') {
        throw new Error(`Provider has no 'name' key.`);
      }

      const { name } = provider;

      if ('useValue' in provider) {
        this.registry[name] = provider.useValue;
      } else if ('useFactory' in provider) {
        this.registry[name] = provider.useFactory();
      } else if ('useClass' in provider) {
        const depsInstances = {}; // @TODO

        if (Array.isArray(provider.deps)) {
          provider.deps.forEach((depName) => {
            if (!(depName in this.registry)) {
              throw new Error(`For provider '${name}', dependency '${depName}' is not available yet.`);
            }

            depsInstances[depName] = this.registry[depName];
          });
        } else if (typeof provider.deps === 'object') {
          Object.keys(provider.deps)
            .forEach((containerDepName) => {
              if (!(containerDepName in this.registry)) {
                throw new Error(`For provider '${name}', dependency '${containerDepName}' is not available yet.`);
              }

              const targetDepName = provider.deps[containerDepName];
              depsInstances[targetDepName] = this.registry[containerDepName];
            });
        }

        this.registry[name] = new provider.useClass(depsInstances);
      } else {
        throw new Error(`No value given for '${name}' provider.`)
      }
    }

    get(name) {
      return this.registry[name];
    }
  }

  return Container;
}
