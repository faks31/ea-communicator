<script lang="ts" setup>
const config = useRuntimeConfig();

interface CitiesData {
  name: string;
}
interface StateData {
  name: string;
  cities: CitiesData[];
}

interface CountryData {
  name: string;
  states: StateData[];
}

interface RecipientData {
  id: number;
  firstName: string;
  lastName: string;
}

interface initialStateData {
  groupName: string;
  alternateEmail: string;
  status: boolean;
  notes: string;
  location: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  selectedCountry: CountryData;
  selectedState: StateData;
  deviceId: string;
}

const groupService = useService('group');
const { id: groupId } = useRoute().params;
const statuses = ['Inactive', 'active'];

const { data: location } = await useFetch<any>(() => `/json/locations.json`);
const { data: groupDetail } = await useFetch<any>(() => `groups/${groupId}`, {
  baseURL: config.public.API_SMARTSUITE_BASE_URL,
});

const record = groupDetail.value.data;
const initialState: initialStateData = {
  groupName: record.groupName,
  alternateEmail: record.alternateEmail,
  status: record.status,
  notes: record.notes,
  location: record.location,
  city: record.city,
  state: record.state,
  zipCode: record.zipCode,
  country: record.country,
  selectedCountry: { name: '', states: [{ name: '', cities: [{ name: '' }] }] },
  selectedState: { name: '', cities: [{ name: '' }] },
  deviceId: record.country,
};
const data = reactive({ ...initialState });

data.selectedCountry = location.value.filter(function (country: StateData) {
  return country.name === record.country;
})[0];

data.selectedState = data.selectedCountry.states.filter(function (
  state: CitiesData,
) {
  return state.name === record.state;
})[0];

const statusText = ref<string>('active');
const successResponse = ref({ data: { id: null } });
const recipients = ref<RecipientData[] | []>(
  record.recipients.map(({ id, firstName, lastName }: RecipientData) => ({
    id,
    firstName,
    lastName,
  })),
);

function resetForm() {
  Object.assign(data, initialState);
  recipients.value = [];
}
const selectCountry = () => {
  const selectLocation = location.value.filter(function (country: StateData) {
    return country.name === data.country;
  });

  data.selectedCountry = selectLocation[0] || initialState.selectedCountry;
};

const selectState = () => {
  const selectLocation = data.selectedCountry.states.filter(function (state) {
    return state.name === data.state;
  });

  data.selectedState = selectLocation[0] || initialState.selectedState;
};

const submitHandler = async () => {
  data.status = statusText.value === 'active';

  const request = {
    ...data,
    status: statusText.value === 'active',
    recipients: recipients.value.map(({ id }) => ({
      id,
    })),
  };
  const response = await groupService.update(Number(groupId), request);
  successResponse.value = response;
  resetForm();
};

const setRecipients = (recipientSelected: RecipientData[]) => {
  recipients.value = recipientSelected;
};
</script>

<template>
  <div>
    <FormKit
      type="form"
      id="updateGroup"
      @submit="submitHandler"
      :actions="false"
      #default="{ value }"
    >
      <div class="flex flex-wrap justify-between items-center mb-10">
        <div mb-5>
          <h4 class="mb-4 text-carbon">Groups</h4>
          <p class="text-silver">
            Smart Suite / Communicator / Groups /
            <span class="text-primary">Create New Group</span>
          </p>
        </div>
      </div>
      <div w-full>
        <div class="success alert-success" v-if="successResponse.data.id">
          Group Successfully Updated
        </div>
        <div grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5>
          <div bg-white small-shadow p-6 md:col-span-2 col-span-1>
            <h5 text-stone>Create New Group</h5>
            <div grid md:grid-cols-2 grid-cols-1 gap-5 my-8 md:w-auto w-full>
              <FormKit
                v-model="data.groupName"
                type="text"
                name="name"
                validation="required"
                placeholder="Group Name"
                input-class="form-control"
              />

              <FormKit
                v-model="data.alternateEmail"
                type="text"
                name="alternate"
                validation="required"
                placeholder="Alternate Email"
                input-class="form-control"
              />

              <FormKit
                v-model="statusText"
                type="select"
                validation="required"
                name="status"
                input-class="form-control"
                placeholder="Select Status"
                :options="statuses"
              />
              <FormKit
                v-model="data.country"
                type="select"
                validation="required"
                name="country"
                input-class="form-control"
                placeholder="Select Country"
                :options="
                  location.map((item: StateData) => {
                    return item.name;
                  })
                "
                @change="selectCountry"
              />

              <FormKit
                v-model="data.state"
                type="select"
                validation="required"
                name="state"
                input-class="form-control"
                placeholder="Select State / Territory"
                :options="
                  data.selectedCountry.states
                    ? data.selectedCountry.states.map((item: StateData) => {
                        return item.name;
                      })
                    : []
                "
                @change="selectState"
              />

              <FormKit
                v-model="data.city"
                type="select"
                validation="required"
                name="city"
                input-class="form-control"
                placeholder="Select City"
                :options="
                  data.selectedState.cities
                    ? data.selectedState.cities.map((item: CitiesData) => {
                        return item.name;
                      })
                    : []
                "
              />

              <FormKit
                v-model="data.zipCode"
                name="zip"
                validation="required"
                type="number"
                placeholder="Zip Code"
                input-class="form-control"
              />
              <FormKit
                v-model="data.location"
                name="location"
                validation="required"
                type="text"
                placeholder="Location"
                input-class="form-control"
              />
              <FormKit
                v-model="data.notes"
                name="notes"
                validation="required"
                type="textarea"
                rows="10"
                placeholder="Note"
                input-class="form-control"
                outer-class="md:col-span-2 col-span-1"
              />
            </div>
            <div>
              <h6 class="text-carbon">Recipient Added</h6>
              <div class="flex flex-wrap items-center gap-2 overflow-x-auto">
                <span
                  class="border border-solid border-primary py-[6px] px-[16px] rounded-[24px] text-primary"
                  v-for="recipient in recipients"
                  :key="recipient.id"
                >
                  {{ recipient.firstName }} {{ recipient.lastName }}
                </span>
              </div>
            </div>
            <div class="flex justify-end items-center mt-5 md:w-auto w-full">
              <button class="btn btn-primary md:w-auto w-full">
                Update Group
              </button>
            </div>
          </div>
          <ViewRecipients
            :recipients="recipients"
            @set-recipients="setRecipients"
          ></ViewRecipients>
        </div>
      </div>
    </FormKit>
  </div>
</template>

<style lang="scss"></style>