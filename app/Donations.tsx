'use client'

import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { ClipboardIcon } from '@heroicons/react/20/solid'
import { LinkIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'flowbite-react'
import {
  Option,
  categoryDetails,
  icons,
  organizations,
  initialSortOptions,
  initialFilters,
  explorers,
} from '../config/donations';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Organizations() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortOptions, setSortOptions] = useState(initialSortOptions);
  const [filters, setFilters] = useState(initialFilters);
  const cryptoFilter = filters[0].options[0].checked;
  const optionToIconUrl = (option: Option ) => (option.type === 'cryptocurrency')
                                             ? icons.cryptocurrencies[option.name]
                                             : icons[option.type];

  const checkboxChangeHandler = ({target}: any) => {
    const {checked, id} = target;
    setFilters(prev => {
      const idParts = id.split("-");
      const clickedCategory = prev.find(item => item.id.toString() === idParts[1]);
      if (!clickedCategory) {
        return [...prev];
      }
      const clickedOption = clickedCategory?.options.find(item => item.id.toString() === idParts[2]);
      if (!clickedOption) {
        return [...prev];
      }
      clickedOption.checked = checked;
      return [...prev];
    });
  }

  const changeSortHandler = ({target}: any) => {
    setSortOptions(prev => {
      const currentOption = prev.find(item => item.current === true);
      if (!currentOption) {
        return [...prev];
      }
      currentOption.current = false;
      const clickedOption = prev.find(item => item.name.toString() === target.innerText);
      if (!clickedOption) {
        return [...prev];
      }
      clickedOption.current = true;
      return [...prev];
    });
  }

  const isOrganizationFiltered = (organization: any) => {
    const categoryFilters = filters.find(item => item?.id.toString() === 'categories');
    if (categoryFilters === undefined) {
      alert("Assertion failed A");
      return false;
    }
    for (var category of organization.categories) {
      var categoryFilterOption = categoryFilters.options.find(item => item.id === category)
      if (categoryFilterOption === undefined) {
        alert("Assertion failed B");
        return false;
      }
      if (categoryFilterOption.checked === false) {
        return false;
      }
    }
    // Look for a filtered option
    for (var option of organization.options) {
      if (isOptionFiltered(option)) {
        return true;
      }
    }
    // The organization doesn't have any filtered options
    return false;
  }

  const isOptionFiltered = (option: any) => {
    const typeFilters = filters.find(item => item?.id.toString() === 'types');
    if (typeFilters === undefined) {
      alert("Assertion failed C");
      return false;
    }
    var typeFilter = typeFilters.options.find(item => item.id === option.type);
    if (typeFilter === undefined) {
      alert("Assertion failed D " + option.type);
      return false;
    }
    if (option.type === "cryptocurrency" && typeFilter.checked) {
      var cryptocurrencyFilters = filters.find(item => item?.id.toString() === 'cryptocurrencies');
      if (cryptocurrencyFilters === undefined) {
        alert("Assertion failed E");
        return false;
      }
      var cryptocurrencyFilter = cryptocurrencyFilters.options.find(item => item.id === option.name);
      if (cryptocurrencyFilter === undefined) {
        alert("Assertion failed F " + option.name);
        return false;
      }
      return cryptocurrencyFilter.checked;
    } else {
      return typeFilter.checked;
    }
  }

  return (
    <div className="bg-white px-6 lg:px-8">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>

                    {filters.map((section) => (
                      (section.id != 'cryptocurrencies' || cryptoFilter) ?
                        <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                          {({ open }) => (
                            <>
                              <h3 className="-mx-2 -my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                  <span className="font-medium text-gray-900">{section.name}</span>
                                  <span className="ml-2 flex items-center">
                                    {open ? (
                                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-6">
                                <div className="space-y-6">
                                  {section.options.map((option) => (
                                    <div key={option.id} className="flex items-center">
                                      <input
                                        id={`filter-${section.id}-${option.id}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.id}
                                        type="checkbox"
                                        defaultChecked={option.checked}

                                        onChange={checkboxChangeHandler}
                                        className="h-4 w-4 rounded border-gray-300 text-red-600"
                                      />
                                      <label
                                        htmlFor={`filter-${section.id}-${option.id}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      : <></>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between border-b border-gray-200 pt-24 pb-6">
            <div className="font-bold tracking-tight">
              <h2 className="text-base font-semibold text-red-600">You Can Make a Difference</h2>
              <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Donate Now
              </p>
            </div>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                {/* <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div> */}

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              onClick={changeSortHandler}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900 cursor-default' : 'text-gray-500 cursor-pointer',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="group inline-flex -m-2 ml-4 p-2 text-gray-700 hover:text-gray-900 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <p className='text-sm font-medium'>
                  Filters
                </p>
                <FunnelIcon className="text-gray-400 group-hover:text-gray-500 h-5 w-5 ml-1" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  (section.id != 'cryptocurrencies' || cryptoFilter) ?
                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">{section.name}</span>
                              <span className="ml-2 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option) => (
                                <div key={option.id} className="flex items-center">
                                  <input
                                    id={`filter-${section.id}-${option.id}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.id}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    onChange={checkboxChangeHandler}
                                    className="h-4 w-4 rounded border-gray-300 text-red-600"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${option.id}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  : <></>
                ))}
              </form>

              {/* Contents */}
              <div className="lg:col-span-3">
                {organizations.map((organization: any) => (
                  isOrganizationFiltered(organization) &&
                  <div data-type="organization" className="bg-gray-50 mb-8 sm:rounded-lg border-solid border-4 border-gray-100 shadow ring-1 ring-black ring-opacity-5">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                      <div className="-ml-4 -mt-4 flex flex-wrap items-center sm:flex-nowrap grow justify-center">
                        <div className="ml-4 mt-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <img
                                className="h-16 w-16 mix-blend-multiply"
                                src={organization.logoUrl}
                              />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold ml-1 leading-6 text-gray-900">
                                {organization.name}
                              </h3>
                              <div className='space-x-2'>
                                {organization.categories.map((category: any) => (
                                  <span className={classNames(
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                    categoryDetails[category].classes
                                  )}>
                                    {categoryDetails[category].name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex grow justify-center sm:justify-end">
                          <Link href={organization.twitterUrl}>
                            <button
                              type="button"
                              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                              <div className="-ml-1 mr-2 h-5 w-5 text-gray-400 fill-current" aria-hidden="true">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                              </div>
                              <span>Twitter</span>
                            </button>
                          </Link>
                          <Link href={organization.websiteUrl}>
                            <button
                              type="button"
                              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                              <LinkIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                              <span>Website</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                
                    <div className="px-4 sm:px-6 lg:px-8">
                      <p className="mt-4 text-sm text-gray-700">
                        {organization.description}
                      </p>
                      <div className="mt-6 flex flex-col">
                        <div className="-mt-2 -mx-4 overflow-x-auto sm:mb-4 sm:-mx-6 lg:-mx-8 border-gray-200 border-t sm:border-none">
                          <div className="min-w-full align-middle sm:py-2 md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                              <table className="flex flex-col divide-y divide-gray-300">
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  {organization.options.map((option: Option) => (
                                    isOptionFiltered(option) &&
                                    <tr key={option.name} className="flex justify-items-end w-full place-items-center py-2 sm:py-5">
                                      <td className="text-sm px-2 sm:px-3">
                                        <div className="flex sm:w-28 items-center">
                                          <div className="h-6 w-6 flex-shrink-0">
                                            <img className="h-6 w-6 rounded-full" src={optionToIconUrl(option)} alt="" />
                                          </div>
                                          <div className="hidden sm:block ml-2">
                                            <div className="font-medium text-gray-600">
                                              {option.name}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="truncate text-sm text-gray-500 ">
                                        {option.type === 'cryptocurrency'
                                          ? <div>
                                              <p className="truncate">{option.address}</p>
                                              <div className='space-x-2 mt-0.5'>
                                                <Link href={`${explorers[option.name]}${option.address}`} passHref={true}>
                                                  <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-900">
                                                    <span className="truncate ">Explorer</span>
                                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                      </svg>
                                                    </span>
                                                </Link>
                                                {option.sourceUrls?.map((sourceUrl: string) => (
                                                  <Link href={sourceUrl} passHref={true}>
                                                    <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-900">
                                                      Source
                                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                      </svg>
                                                    </span>
                                                  </Link>
                                                  ))}
                                              </div>
                                            </div>
                                          : option.linkUrl
                                            ?<Link className="truncate" href={option.linkUrl}>{option.linkName}</Link>
                                            :<p>{option.linkName}</p>
                                        }
                                      </td>
                                      <td className="px-2 sm:px-3 md:space-x-1 text-sm text-gray-400 grow inline-flex place-items-center justify-end">
                                        {
                                          option.info &&
                                            <Tooltip content={option.info} className="align-center" placement="right">
                                              <div className='flex items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                </svg>
                                              </div>
                                            </Tooltip>
                                        }
                                        {
                                          option.warning &&
                                            <Tooltip content={option.warning} className="align-center" placement="right">
                                              <div className='flex items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                                                </svg>
                                              </div>
                                            </Tooltip>
                                        }
                                        <button
                                          type="button"
                                          className={
                                            classNames(
                                              "relative sm:ml-1 md:ml-2 l-5 inline-flex items-center rounded-md sm:border border-gray-300 bg-white sm:px-4 sm:py-2 font-medium text-gray-700 sm:shadow-sm hover:bg-gray-50 float-right",
                                              option.address ? "block" : "hidden"
                                            )
                                          }
                                          onClick={() => {
                                            if (option.address) {
                                              toast(
                                                <div className='inline-flex items-center'>
                                                  <ClipboardIcon className="h-8 w-8 sm:h-8 sm:w-8 text-gray-200 mr-5" aria-hidden="true" />
                                                  <p>Copied {option.name} address of {organization.name}"</p>
                                                </div>
                                                , {
                                                position: "bottom-center",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: false,
                                                theme: "dark",
                                                });
                                              navigator.clipboard.writeText(option.address);
                                            }
                                          }}
                                        >
                                          <ClipboardIcon className="-ml-0.5 h-6 w-6 sm:h-4 sm:w-4 text-gray-400" aria-hidden="true" />
                                          <p className='hidden md:block ml-2'>Copy</p>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <ToastContainer pauseOnFocusLoss={false}/>
    </div>
  )
}
