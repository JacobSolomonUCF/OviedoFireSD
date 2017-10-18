package comtelekpsi.github.oviedofireandroid;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.text.InputFilter;
import android.text.InputType;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.SeekBar;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;



/**
 * Created by David on 9/9/2017.
 */

public class FormJSONParser {
    public static void formParse(String str, TextView titleTextView, TableLayout mTableLayout, Context context){
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            String formTitle=object.getString("title");
            titleTextView.setText(formTitle);
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
            }
            //handle subsections
            if (!object.isNull("subSections")){
                System.out.println("this happened");
                JSONArray subSections = object.getJSONArray("subSections");
                System.out.println("number of subsections: "+subSections.length());
                for (int s=0; s<subSections.length(); s++){
                    TableRow sTableRow = new TableRow(context);
                    mTableLayout.addView(sTableRow);
                    sTableRow.setBackgroundColor(Color.LTGRAY);
                    TextView sTextView = new TextView(context);
                    sTableRow.addView(sTextView);
                    sTextView.setTextColor(Color.BLACK);
                    JSONObject subSectionsObject=subSections.getJSONObject(s);
                    String subSectionsTitle=subSectionsObject.getString("title");
                    sTextView.setText(subSectionsTitle);
                    //// TODO: make section title large and/or bold and/or underlined
                    sTableRow.setTag("subSection");

                    int inSectionCount=0;
                    inSectionCount=subSectionsObject.getJSONArray("inputElements").length();
                    System.out.println("inSectionCount: " + inSectionCount);
                    String inSectionCountString=Integer.toString(inSectionCount);
                    inputElementsParse(subSectionsObject, mTableLayout, context);
                    sTextView.setHint(inSectionCountString);
                }
            }
            else{
                inputElementsParse(object, mTableLayout, context);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    static void inputElementsParse(JSONObject jObject, TableLayout mTableLayout, Context context) {
        JSONArray items = null;
        try {
            items = jObject.getJSONArray("inputElements");
            System.out.println("items length is " + items.length());
            for (int i = 0; i < items.length(); i++) {
                TableRow tableRow = new TableRow(context);
                mTableLayout.addView(tableRow);
                TextView textView = new TextView(context);
                JSONObject itemsObject = items.getJSONObject(i);
                String caption = itemsObject.getString("caption");
                textView.setText(caption);
                textView.setTextColor(Color.BLACK);
                tableRow.addView(textView);
                String type = itemsObject.getString("type");
                tableRow.setTag(type);
                textView.setTag("caption");
                if (type.equals("pmr")) {
                    PMR pmr = new PMR(mTableLayout, tableRow, textView, context, caption);
                }
                if (type.equals("pf")) {
                    PF pf = new PF(mTableLayout, tableRow, context, caption);
                }
                if (type.equals("num")) {
                    EditText editText = new EditText(context);
                    InputFilter[] fa= new InputFilter[1];
                    fa[0] = new InputFilter.LengthFilter(10);
                    editText.setFilters(fa);
                    editText.setInputType(InputType.TYPE_CLASS_NUMBER);
                    tableRow.addView(editText);
                }
                if (type.equals("per")) {
                    SeekBar seekBar = new SeekBar(context);
                    seekBar.setMax(100);
                    seekBar.setBackgroundColor(Color.GREEN);
                    tableRow.addView(seekBar);

                    TableRow textRow = new TableRow(context);
                    textRow.setTag("Text Row");
                    mTableLayout.addView(textRow);
                    TextView labelText = new TextView(context);
                    labelText.setText("");
                    textRow.addView(labelText);

                    final TextView numberText = new TextView(context);
                    numberText.setText("");
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
                }
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
