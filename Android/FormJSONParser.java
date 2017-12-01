package comtelekpsi.github.oviedofireandroid;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.app.Activity;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.support.v4.app.DialogFragment;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Bundle;
//import android.support.v4.app.DialogFragment;
import android.support.v7.widget.AppCompatButton;
import android.text.InputFilter;
import android.text.InputType;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;


/**
 * Created by David on 9/9/2017.
 */

public class FormJSONParser extends FragmentActivity{
    private static int buttonCount=0;
    /*private static View.OnClickListener OCL;
    public FormJSONParser(){
        System.out.println("Constructor created");
        OCL=new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                System.out.println("OCL got called");
                DialogFragment newFragment = new DatePickerFragment();
                System.out.println("OCL got called2");
                newFragment.show(getSupportFragmentManager(),"Date Picker");
            }
        };
    }*/
    public static void formParse(String str, TextView titleTextView, TableLayout mTableLayout, Context context, boolean isTablet, LinearLayout mLinearLayout, boolean edit){
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            String formTitle=object.getString("title");
            String prevCB=object.optString("prevCompletedBy");
            TextView prevCBTextView=(TextView)mLinearLayout.getChildAt(3);
            prevCBTextView.setText("Previously completed by: "+prevCB);
            String prevDate=object.optString("prevDate");
            TextView prevDateTextView=(TextView)mLinearLayout.getChildAt(4);
            prevDateTextView.setText("Previously completed on: "+prevDate);
            titleTextView.setText(formTitle);
            if(isTablet){
                titleTextView.setTextSize(30);
                prevCBTextView.setTextSize(30);
                prevDateTextView.setTextSize(30);
            }
            //Check for Alert and create popup
            if (!object.isNull("alert")){
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setMessage(object.getString("alert"))
                        .setCancelable(false)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                //do things
                            }
                        });
                AlertDialog alert = builder.create();
                alert.show();
                TextView alertText = (TextView) alert.findViewById(android.R.id.message);
                if(isTablet)alertText.setTextSize(25);
            }
            //handle subsections
            if (!object.isNull("subSections")){
                JSONArray subSections = object.getJSONArray("subSections");
                int length=subSections.length();
                System.out.println("number of subsections: "+subSections.length());
                if (length>1) {
                    for (int s = 0; s < length; s++) {
                        TableRow sTableRow = new TableRow(context);
                        mTableLayout.addView(sTableRow);
                        sTableRow.setBackgroundColor(Color.parseColor("#2b4162"));
                        TextView sTextView = new TextView(context);
                        sTableRow.addView(sTextView);
                        sTextView.setTextColor(Color.BLACK);

                        JSONObject subSectionsObject = subSections.getJSONObject(s);
                        String subSectionsTitle = subSectionsObject.getString("title");
                        sTextView.setText(subSectionsTitle);
                        if (isTablet) sTextView.setTextSize(35);
                        else sTextView.setTextSize(20);
                        sTableRow.setTag("subSection");

                        int inSectionCount = 0;
                        inSectionCount = subSectionsObject.getJSONArray("inputElements").length();
                        System.out.println("inSectionCount: " + inSectionCount);
                        String inSectionCountString = Integer.toString(inSectionCount);
                        inputElementsParse(subSectionsObject, mTableLayout, context, isTablet, mLinearLayout);
                        sTextView.setHint(inSectionCountString);
                    }
                }
                else{
                    TableRow sTableRow = new TableRow(context);
                    mTableLayout.addView(sTableRow);
                    sTableRow.setBackgroundColor(Color.parseColor("#2b4162"));
                    TextView sTextView = new TextView(context);
                    sTableRow.addView(sTextView);
                    sTextView.setTextColor(Color.BLACK);

                    JSONObject subSectionsObject = subSections.getJSONObject(0);
                    String subSectionsTitle = subSectionsObject.getString("title");
                    sTextView.setText(subSectionsTitle);
                    if (isTablet) sTextView.setTextSize(35);
                    else sTextView.setTextSize(20);
                    sTableRow.setTag("subSection");

                    int inSectionCount = 0;
                    inSectionCount = subSectionsObject.getJSONArray("inputElements").length();
                    System.out.println("inSectionCount: " + inSectionCount);
                    String inSectionCountString = Integer.toString(inSectionCount);
                    inputElementsParse(subSectionsObject, mTableLayout, context, isTablet, mLinearLayout);
                    sTextView.setHint(inSectionCountString);
                }
            }
            else{
                inputElementsParse(object, mTableLayout, context, isTablet, mLinearLayout);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    static void inputElementsParse(JSONObject jObject, TableLayout mTableLayout, Context context, boolean isTablet, LinearLayout mLinearLayout) {
        JSONArray items = null;

        try {
            items = jObject.getJSONArray("inputElements");
            System.out.println("items length is " + items.length());
            for (int i = 0; i < items.length(); i++) {
                TableRow tableRow = new TableRow(context);
                int width=mLinearLayout.getWidth();
                TableLayout.LayoutParams rowParams = new TableLayout.LayoutParams(width, ViewGroup.LayoutParams.MATCH_PARENT);
                tableRow.setLayoutParams(rowParams);
                mTableLayout.addView(tableRow);
                TextView textView = new TextView(context);
                JSONObject itemsObject = items.getJSONObject(i);
                String caption = itemsObject.getString("caption");
                textView.setText(caption);
                textView.setTextColor(Color.BLACK);
                tableRow.addView(textView);
                String type = itemsObject.getString("type");
                String note = itemsObject.optString("prevNote");
                tableRow.setTag(type);
                textView.setTag("caption");
                TableRow.LayoutParams textParams = new TableRow.LayoutParams(width/2, ViewGroup.LayoutParams.MATCH_PARENT);
                TableRow.LayoutParams textParams3 = new TableRow.LayoutParams(width/3, ViewGroup.LayoutParams.MATCH_PARENT);
                if (type.equals("pmr")) {
                    PMR pmr = new PMR(mTableLayout, tableRow, textView, context, caption, isTablet, itemsObject, width, note,null);
                }
                if (type.equals("pf")) {
                    PF pf = new PF(mTableLayout, tableRow, context, caption, isTablet, width, null);
                    if (!itemsObject.isNull("prev")){
                        AddPrevResult.AddPrev(mTableLayout,itemsObject.getString("prev"), context, isTablet, width,1);
                    }
                }
                if (type.equals("num")) {
                    EditText editText = new EditText(context);
                    InputFilter[] fa= new InputFilter[1];
                    fa[0] = new InputFilter.LengthFilter(10);
                    editText.setFilters(fa);
                    editText.setInputType(InputType.TYPE_CLASS_NUMBER);
                    if(isTablet)editText.setTextSize(25);
                    tableRow.addView(editText);
                    editText.setLayoutParams(textParams);
                    editText.setGravity(Gravity.RIGHT);
                    if (!itemsObject.isNull("prev")){
                        AddPrevResult.AddPrev(mTableLayout, itemsObject.getString("prev"), context, isTablet, width, 2);
                    }
                }
                if (type.equals("date")) {
                    buttonCount++;
                    AppCompatButton button=new AppCompatButton(context);
                    TextView dateText = new TextView(context);
                    tableRow.addView(dateText);
                    dateText.setLayoutParams(textParams3);
                    if(isTablet)dateText.setTextSize(25);
                    tableRow.addView(button);
                    button.setLayoutParams(textParams3);
                    button.setText("Select a date");
                    if(isTablet)button.setTextSize(25);
                    dateText.setGravity(Gravity.CENTER_HORIZONTAL);
                    button.setGravity(Gravity.RIGHT);
                    //button.setOnClickListener(OCL);
                    mTableLayout.setTag(buttonCount);
                    if (!itemsObject.isNull("prev")){
                        AddPrevResult.AddPrev(mTableLayout, itemsObject.getString("prev"), context, isTablet, width, 2);
                    }
                }
                if (type.equals("per")) {
                    SeekBar seekBar = new SeekBar(context);
                    seekBar.setMax(100);
                    seekBar.setBackgroundColor(Color.GREEN);
                    tableRow.addView(seekBar);
                    TableRow.LayoutParams seekbarParams = new TableRow.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
                    seekBar.setLayoutParams(seekbarParams);

                    TableRow textRow = new TableRow(context);
                    textRow.setTag("Text Row");
                    mTableLayout.addView(textRow);
                    TextView labelText = new TextView(context);
                    labelText.setText("");
                    textRow.addView(labelText);
                    final TextView numberText = new TextView(context);
                    numberText.setText("");
                    if(isTablet){
                        numberText.setTextSize(18);
                        labelText.setTextSize(18);
                    }
                    textRow.addView(numberText);

                    seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                        @Override
                        public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                            numberText.setText(Integer.toString(progress) + "%");
                        }
                        @Override
                        public void onStartTrackingTouch(SeekBar seekBar) {
                        }
                        @Override
                        public void onStopTrackingTouch(SeekBar seekBar) {
                        }
                    });
                    if (!itemsObject.isNull("prev")){
                        AddPrevResult.AddPrev(mTableLayout,itemsObject.getString("prev"), context, isTablet, width,3);
                    }
                }
                if (isTablet) textView.setTextSize(25);
                textView.setLayoutParams(textParams);
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
