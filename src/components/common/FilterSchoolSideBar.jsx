import React, { useEffect, useState } from "react"
import { Checkbox, Select, Slider, Form, Input } from "antd"
import "../../assets/scss/FilterSideBar.scss"
import SchoolApi from "../../api/SchoolApi"

const { Option } = Select

const FilterSchoolSideBar = ({ onFilterChange }) => {
  const [schoolType, setSchoolType] = useState(1);
  const [schoolAge, setSchoolAge] = useState(1);
  const [feeRange, setFeeRange] = useState([1000000, 20000000]);
  const [facilities, setFacilities] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const [ageRange, setAgeRange] = useState([]);
  const [type, setType] = useState([]);
  const [maxFee, setMaxFee] = useState("2 million");
  const [minFee, setMinFee] = useState("1 million");
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [utilityOptions, setUtilityOptions] = useState([]);
  const handleTypeChange = (value) => setSchoolType(value);
  const handleAgeChange = (value) => setSchoolAge(value);
  const handleFeeChange = (value) => setFeeRange(value);
  const handleFacilityChange = (checkedValues) => setFacilities(checkedValues);
  const handleUtilityChange = (checkedValues) => setUtilities(checkedValues);

  useEffect(() => {
    const filters = {
      schoolType,
      schoolAge,
      feeRange,
      facilities,
      utilities,
    };
    onFilterChange(filters);
  }, [schoolType, schoolAge, feeRange, facilities, utilities, onFilterChange]);

  useEffect(() => {
    const filters = {
      schoolType,
      schoolAge,
      feeRange,
      facilities,
      utilities,
    };
    onFilterChange(filters);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const faci = await SchoolApi.getSchoolFacilitiesPublic();
        setFacilityOptions(faci.data);
        const uti = await SchoolApi.getSchoolUtilitiesPublic();
        setUtilityOptions(uti.data);

        const age = await SchoolApi.getSchoolRangeAgePublic();
        setAgeRange(age.data);
        const ty = await SchoolApi.getSchoolTypePublic();
        setType(ty.data);
      } catch (error) {
        console.error("Error fetching required data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (feeRange[1] > feeRange[0]) {
      setMaxFee((feeRange[1] / 1000000).toFixed(0) + " millions");
      setMinFee((feeRange[0] / 1000000).toFixed(0) + " millions");
    } else {
      setMaxFee((feeRange[0] / 1000000).toFixed(0) + " millions");
      setMinFee((feeRange[1] / 1000000).toFixed(0) + " millions");
    }
  }, [feeRange]);
  return (
    <div className="filter-component">
      <h6 style={{ color: "#3598BE", fontWeight:'bolder', color:'#1A9FFA' }}> Refine your search </h6>
      <Form layout="vertical">
        <Form.Item label="Type of schools">
          <Select value={schoolType || 1} onChange={handleTypeChange} placeholder="Type">
            {type.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Admission age (from)">
          <Select defaultValue={1} value={schoolAge || 1} onChange={handleAgeChange}  placeholder="Age" >
            <Option key={1} value={1}>
              6 Months
            </Option>
            <Option key={2} value={2}>
              1 Year
            </Option>
            <Option key={3} value={3}>
              3 Year
            </Option>
          </Select>
        </Form.Item>

                <Form.Item label="Monthly fee (VND/month)">
                    <Slider
                        range
                        min={1000000}
                        max={20000000}
                        step={1000000}
                        value={feeRange}
                        onChange={handleFeeChange}
                    />
                </Form.Item>
                <div style={{ display: "flex" }}>
                    <Form.Item label="Min">
                        <Input value={minFee} type="text"></Input>
                    </Form.Item>
                    <Form.Item label="Max">
                        <Input value={maxFee} type="text"></Input>
                    </Form.Item>
                </div>

                <Form.Item label="Facilities">
                    <Checkbox.Group
                        style={{ width: "160px" }}
                        options={facilityOptions.map((fa) => ({
                            label: fa.name,
                            value: fa.id
                        }))}
                        value={facilities}
                        onChange={handleFacilityChange}
                    />
                </Form.Item>
                <Form.Item label="Utilities">
                    <Checkbox.Group
                        style={{ width: "160px" }}
                        options={utilityOptions.map((uti) => ({
                            label: uti.name,
                            value: uti.id
                        }))}
                        value={utilities}
                        onChange={handleUtilityChange}
                    />
                </Form.Item>
            </Form>
        </div>
    )
}

export default FilterSchoolSideBar
